import type { ExportPdfPayload, PdfExportOptions } from './ipc'

export const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  pageSize: 'A4',
  landscape: false,
  margins: {
    topMm: 20,
    bottomMm: 20,
    leftMm: 20,
    rightMm: 20
  }
}

export function sanitizeDocumentTitle(title: string): string {
  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    return 'Untitled'
  }

  return trimmedTitle.replace(/\s+•$/, '')
}

function lastPathSeparatorIndex(filePath: string): number {
  return Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))
}

function fileNameFromPathLike(filePath: string): string {
  const separatorIndex = lastPathSeparatorIndex(filePath)
  return separatorIndex === -1 ? filePath : filePath.slice(separatorIndex + 1)
}

function directoryFromPathLike(filePath: string): string {
  const separatorIndex = lastPathSeparatorIndex(filePath)
  return separatorIndex === -1 ? '' : filePath.slice(0, separatorIndex)
}

function joinPathLike(directory: string, fileName: string): string {
  if (!directory) {
    return fileName
  }

  const separator = directory.includes('\\') ? '\\' : '/'
  return `${directory}${separator}${fileName}`
}

function extensionFromPathLike(filePath: string): string {
  const fileName = fileNameFromPathLike(filePath)
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex).toLowerCase()
}

function basenameWithoutExtension(fileName: string, extension: string): string {
  return extension ? fileName.slice(0, -extension.length) : fileName
}

export function pdfFileNameFromMarkdownName(fileName: string): string {
  const title = sanitizeDocumentTitle(fileName)
  const titleFileName = fileNameFromPathLike(title)
  const extension = extensionFromPathLike(title)

  if (extension === '.md' || extension === '.markdown') {
    return `${basenameWithoutExtension(titleFileName, extension)}.pdf`
  }

  if (extension === '.pdf') {
    return titleFileName
  }

  return `${titleFileName}.pdf`
}

export function ensurePdfExtension(filePath: string): string {
  return extensionFromPathLike(filePath) === '.pdf' ? filePath : `${filePath}.pdf`
}

export function defaultPdfPathForPayload(payload: Pick<ExportPdfPayload, 'defaultFileName' | 'sourceFilePath'>): string {
  const fileName = pdfFileNameFromMarkdownName(payload.defaultFileName)

  if (!payload.sourceFilePath) {
    return fileName
  }

  return joinPathLike(directoryFromPathLike(payload.sourceFilePath), fileName)
}

export function normalizePdfOptions(options?: Partial<PdfExportOptions>): PdfExportOptions {
  return {
    pageSize: options?.pageSize ?? DEFAULT_PDF_OPTIONS.pageSize,
    landscape: options?.landscape ?? DEFAULT_PDF_OPTIONS.landscape,
    margins: {
      topMm: options?.margins?.topMm ?? DEFAULT_PDF_OPTIONS.margins.topMm,
      bottomMm: options?.margins?.bottomMm ?? DEFAULT_PDF_OPTIONS.margins.bottomMm,
      leftMm: options?.margins?.leftMm ?? DEFAULT_PDF_OPTIONS.margins.leftMm,
      rightMm: options?.margins?.rightMm ?? DEFAULT_PDF_OPTIONS.margins.rightMm
    }
  }
}
