import { app, BrowserWindow, dialog } from 'electron'
import type { BrowserWindowConstructorOptions, SaveDialogOptions } from 'electron'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { ExportPdfPayload, ExportPdfResult, PdfExportOptions } from '../shared/ipc'
import { defaultPdfPathForPayload, ensurePdfExtension, normalizePdfOptions, sanitizeDocumentTitle } from '../shared/pdf'
import { appAssetPath } from './paths'

const PRINT_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  show: false,
  width: 794,
  height: 1123,
  backgroundColor: '#ffffff',
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function readTextIfExists(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

function stripCssImports(css: string): string {
  return css.replace(/^@import\s+[^;]+;\s*$/gm, '')
}

async function readPrintStyles(): Promise<string> {
  const styleDir = appAssetPath('src', 'styles')
  const highlightPath = appAssetPath('node_modules', 'highlight.js', 'styles', 'github.css')

  const [tokensCss, highlightCss, markdownCss, printCss] = await Promise.all([
    readTextIfExists(join(styleDir, 'tokens.css')),
    readTextIfExists(highlightPath),
    readTextIfExists(join(styleDir, 'markdown.css')),
    readTextIfExists(join(styleDir, 'print.css'))
  ])

  return [tokensCss, highlightCss, stripCssImports(markdownCss), printCss].filter(Boolean).join('\n\n')
}

function pageRuleForOptions(options: PdfExportOptions): string {
  const orientation = options.landscape ? 'landscape' : 'portrait'
  const { topMm, bottomMm, leftMm, rightMm } = options.margins

  return `@page { size: ${options.pageSize} ${orientation}; margin: ${topMm}mm ${rightMm}mm ${bottomMm}mm ${leftMm}mm; }`
}

function baseHrefForSource(sourceFilePath: string | null): string {
  if (!sourceFilePath) {
    return pathToFileURL(`${process.cwd()}/`).href
  }

  return pathToFileURL(`${dirname(sourceFilePath)}/`).href
}

function normalizePayloadPaths(payload: ExportPdfPayload): ExportPdfPayload {
  if (!payload.sourceFilePath || isAbsolute(payload.sourceFilePath)) {
    return payload
  }

  return {
    ...payload,
    sourceFilePath: resolve(payload.sourceFilePath)
  }
}

function defaultPdfDialogPath(payload: ExportPdfPayload): string {
  const candidate = defaultPdfPathForPayload(payload)
  return isAbsolute(candidate) ? candidate : join(app.getPath('documents'), candidate)
}

async function createPrintDocumentHtml(payload: ExportPdfPayload, options: PdfExportOptions): Promise<string> {
  const printStyles = await readPrintStyles()
  const title = sanitizeDocumentTitle(payload.documentTitle)

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="${escapeHtml(baseHrefForSource(payload.sourceFilePath))}">
  <title>${escapeHtml(title)}</title>
  <style>
${pageRuleForOptions(options)}
${printStyles}
  </style>
</head>
<body class="mora-print-body">
  <article class="markdown-preview mora-print-document">
${payload.renderedHtml}
  </article>
</body>
</html>`
}

async function waitForPrintAssets(window: BrowserWindow): Promise<void> {
  await window.webContents.executeJavaScript(`
    (async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready.catch(() => undefined);
      }

      const images = Array.from(document.images);
      await Promise.all(images.map((image) => {
        if (image.complete) {
          return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
        }

        return new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }));
    })();
  `)
}

async function writeTemporaryPrintHtml(html: string): Promise<string> {
  const tempDir = join(tmpdir(), 'mora-print')
  await mkdir(tempDir, { recursive: true })

  const filePath = join(tempDir, `print-${randomUUID()}.html`)
  await writeFile(filePath, html, 'utf8')

  return filePath
}

async function removeTemporaryPrintHtml(filePath: string): Promise<void> {
  await rm(filePath, { force: true })
}

export async function createPdfBuffer(payload: ExportPdfPayload): Promise<Buffer> {
  const options = normalizePdfOptions(payload.options)
  const html = await createPrintDocumentHtml(payload, options)
  const htmlPath = await writeTemporaryPrintHtml(html)
  const printWindow = new BrowserWindow(PRINT_WINDOW_OPTIONS)

  try {
    await printWindow.loadFile(htmlPath)
    await waitForPrintAssets(printWindow)

    return await printWindow.webContents.printToPDF({
      pageSize: options.pageSize,
      landscape: options.landscape,
      printBackground: true,
      preferCSSPageSize: true
    })
  } finally {
    if (!printWindow.isDestroyed()) {
      printWindow.close()
    }

    await removeTemporaryPrintHtml(htmlPath)
  }
}

export async function exportPdf(
  payload: ExportPdfPayload,
  parentWindow: BrowserWindow | null
): Promise<ExportPdfResult> {
  const normalizedPayload = normalizePayloadPaths(payload)
  const options: SaveDialogOptions = {
    title: 'Export PDF',
    defaultPath: defaultPdfDialogPath(normalizedPayload),
    filters: [
      {
        name: 'PDF Document',
        extensions: ['pdf']
      }
    ]
  }
  const result = parentWindow
    ? await dialog.showSaveDialog(parentWindow, options)
    : await dialog.showSaveDialog(options)

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  const filePath = ensurePdfExtension(result.filePath)
  const pdfBuffer = await createPdfBuffer(normalizedPayload)
  await writeFile(filePath, pdfBuffer)

  return {
    canceled: false,
    filePath
  }
}
