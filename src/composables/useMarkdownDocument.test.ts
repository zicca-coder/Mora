import { beforeEach, describe, expect, it, vi } from 'vitest'

function installMoraMock() {
  const moraMock = {
    openFile: vi.fn(),
    saveFile: vi.fn(),
    saveFileAs: vi.fn(),
    exportPdf: vi.fn().mockResolvedValue({ canceled: false, filePath: 'E:\\notes\\Draft.pdf' }),
    confirmDiscardChanges: vi.fn().mockResolvedValue(true),
    setDocumentEditedState: vi.fn().mockResolvedValue(undefined),
    setWindowTitle: vi.fn().mockResolvedValue(undefined)
  }

  Object.defineProperty(window, 'mora', {
    value: moraMock,
    configurable: true
  })

  return moraMock
}

describe('useMarkdownDocument', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports current unsaved content without clearing dirty state', async () => {
    const moraMock = installMoraMock()
    const { useMarkdownDocument } = await import('@/composables/useMarkdownDocument')
    const document = useMarkdownDocument()

    document.setContent('# Draft\n\nUnsaved PDF content')
    await document.exportPdfDocument()

    expect(document.documentState.dirty).toBe(true)
    expect(moraMock.saveFile).not.toHaveBeenCalled()
    expect(moraMock.saveFileAs).not.toHaveBeenCalled()
    expect(moraMock.exportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultFileName: 'Untitled.pdf',
        renderedHtml: expect.stringContaining('Unsaved PDF content')
      })
    )
  })

  it('keeps dirty content when new document discard confirmation is canceled', async () => {
    const moraMock = installMoraMock()
    moraMock.confirmDiscardChanges.mockResolvedValue(false)
    const { useMarkdownDocument } = await import('@/composables/useMarkdownDocument')
    const document = useMarkdownDocument()

    document.setContent('Keep this draft')
    await document.newDocument()

    expect(moraMock.confirmDiscardChanges).toHaveBeenCalledWith({
      fileName: 'Untitled'
    })
    expect(document.documentState.content).toBe('Keep this draft')
    expect(document.documentState.dirty).toBe(true)
  })
})
