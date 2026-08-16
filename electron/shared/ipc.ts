export interface MarkdownFile {
  filePath: string
  fileName: string
  content: string
}

export type OpenFileResult =
  | {
      canceled: true
    }
  | ({
      canceled: false
    } & MarkdownFile)

export interface SaveFilePayload {
  filePath: string
  content: string
}

export interface SaveFileAsPayload {
  currentPath: string | null
  content: string
}

export type SaveFileResult =
  | {
      canceled: true
    }
  | ({
      canceled: false
    } & MarkdownFile)

export interface PdfExportMargins {
  topMm: number
  bottomMm: number
  leftMm: number
  rightMm: number
}

export interface PdfExportOptions {
  pageSize: 'A4'
  landscape: boolean
  margins: PdfExportMargins
}

export interface ExportPdfPayload {
  documentTitle: string
  defaultFileName: string
  renderedHtml: string
  sourceFilePath: string | null
  options?: Partial<PdfExportOptions>
}

export type ExportPdfResult =
  | {
      canceled: true
    }
  | {
      canceled: false
      filePath: string
    }

export interface ConfirmDiscardChangesPayload {
  fileName: string
}

export interface DocumentEditedStatePayload {
  fileName: string
  dirty: boolean
}

export interface MoraApi {
  openFile: () => Promise<OpenFileResult>
  saveFile: (payload: SaveFilePayload) => Promise<SaveFileResult>
  saveFileAs: (payload: SaveFileAsPayload) => Promise<SaveFileResult>
  exportPdf: (payload: ExportPdfPayload) => Promise<ExportPdfResult>
  confirmDiscardChanges: (payload: ConfirmDiscardChangesPayload) => Promise<boolean>
  setDocumentEditedState: (payload: DocumentEditedStatePayload) => Promise<void>
  setWindowTitle: (title: string) => Promise<void>
}
