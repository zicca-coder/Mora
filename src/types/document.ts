export type ViewMode = 'editor' | 'preview' | 'split'

export interface MarkdownDocument {
  filePath: string | null
  fileName: string
  content: string
  savedContent: string
  dirty: boolean
}

export interface CursorPosition {
  line: number
  column: number
}

export interface DocumentStats {
  words: number
  characters: number
}
