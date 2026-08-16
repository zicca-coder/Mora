import { describe, expect, it } from 'vitest'
import {
  applyContentChange,
  applySavedDocument,
  calculateDocumentStats,
  createInitialDocument,
  documentTitle,
  windowTitle
} from '@/services/documentModel'

describe('documentModel', () => {
  it('creates an initially clean document', () => {
    const documentState = createInitialDocument()

    expect(documentState.filePath).toBeNull()
    expect(documentState.fileName).toBe('Untitled')
    expect(documentState.content).toBe(documentState.savedContent)
    expect(documentState.dirty).toBe(false)
  })

  it('marks a document dirty when content differs from saved content', () => {
    const documentState = createInitialDocument()

    applyContentChange(documentState, `${documentState.content}\nNew line`)

    expect(documentState.dirty).toBe(true)
  })

  it('clears dirty state when applying a saved document', () => {
    const documentState = createInitialDocument()

    applyContentChange(documentState, 'Draft')
    applySavedDocument(documentState, 'E:\\notes\\README.md', 'README.md', 'Saved')

    expect(documentState).toMatchObject({
      filePath: 'E:\\notes\\README.md',
      fileName: 'README.md',
      content: 'Saved',
      savedContent: 'Saved',
      dirty: false
    })
  })

  it('formats document and window titles with dirty markers', () => {
    expect(documentTitle('README.md', false)).toBe('README.md')
    expect(documentTitle('README.md', true)).toBe('README.md •')
    expect(windowTitle('README.md', true)).toBe('README.md • — Mora')
  })

  it('counts Latin words, CJK characters, and characters', () => {
    expect(calculateDocumentStats('Hello Mora 中文')).toEqual({
      words: 4,
      characters: 13
    })
  })

  it('treats whitespace-only content as empty stats', () => {
    expect(calculateDocumentStats(' \n\t ')).toEqual({
      words: 0,
      characters: 0
    })
  })

  it('normalizes CRLF line endings for character counts', () => {
    expect(calculateDocumentStats('Line 1\r\nLine 2')).toEqual({
      words: 4,
      characters: 13
    })
  })
})
