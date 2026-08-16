import { renderMarkdown } from '@/services/markdown'
import { DEFAULT_PDF_OPTIONS, pdfFileNameFromMarkdownName } from '../../electron/shared/pdf'
import type { ExportPdfResult } from '@/types/ipc'

export async function exportMarkdownPdf(options: {
  content: string
  fileName: string
  filePath: string | null
}): Promise<ExportPdfResult> {
  return window.mora.exportPdf({
    documentTitle: options.fileName,
    defaultFileName: pdfFileNameFromMarkdownName(options.fileName),
    renderedHtml: renderMarkdown(options.content),
    sourceFilePath: options.filePath,
    options: DEFAULT_PDF_OPTIONS
  })
}
