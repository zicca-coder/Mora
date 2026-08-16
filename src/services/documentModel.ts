import type { DocumentStats, MarkdownDocument } from '@/types/document'

export const initialContent = `# Welcome to Mora

Mora is a minimal, beautiful and local-first Markdown editor.

- Write Markdown on the left
- Preview it on the right
- Open and save local .md files
`

export function createInitialDocument(): MarkdownDocument {
  return {
    filePath: null,
    fileName: 'Untitled',
    content: initialContent,
    savedContent: initialContent,
    dirty: false
  }
}

export function calculateDirty(content: string, savedContent: string): boolean {
  return content !== savedContent
}

export function applySavedDocument(
  documentState: MarkdownDocument,
  filePath: string | null,
  fileName: string,
  content: string
): void {
  documentState.filePath = filePath
  documentState.fileName = fileName
  documentState.content = content
  documentState.savedContent = content
  documentState.dirty = false
}

export function applyContentChange(documentState: MarkdownDocument, content: string): void {
  documentState.content = content
  documentState.dirty = calculateDirty(documentState.content, documentState.savedContent)
}

export function documentTitle(fileName: string, dirty: boolean): string {
  return `${fileName}${dirty ? ' •' : ''}`
}

export function windowTitle(fileName: string, dirty: boolean): string {
  return `${documentTitle(fileName, dirty)} — Mora`
}

export function calculateDocumentStats(content: string): DocumentStats {
  const normalizedContent = content.trim()

  if (!normalizedContent) {
    return {
      words: 0,
      characters: 0
    }
  }

  const latinWords = normalizedContent.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g) ?? []
  const cjkCharacters = normalizedContent.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? []

  return {
    words: latinWords.length + cjkCharacters.length,
    characters: Array.from(content.replace(/\r\n/g, '\n')).length
  }
}
