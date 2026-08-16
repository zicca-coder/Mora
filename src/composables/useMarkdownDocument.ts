import { computed, reactive, ref, watch } from 'vue'
import {
  applyContentChange,
  applySavedDocument,
  calculateDocumentStats,
  createInitialDocument,
  documentTitle,
  windowTitle
} from '@/services/documentModel'
import { exportMarkdownPdf } from '@/services/pdf'
import type { CursorPosition, ViewMode } from '@/types/document'

const documentState = reactive(createInitialDocument())

const viewMode = ref<ViewMode>('split')
const cursorPosition = ref<CursorPosition>({ line: 1, column: 1 })
const lastError = ref<string | null>(null)
const isExportingPdf = ref(false)

function updateWindowTitle(): void {
  void window.mora.setWindowTitle(windowTitle(documentState.fileName, documentState.dirty))
}

function updateDocumentEditedState(): void {
  void window.mora.setDocumentEditedState({
    fileName: documentState.fileName,
    dirty: documentState.dirty
  })
}

async function canDiscardCurrentDocument(): Promise<boolean> {
  if (!documentState.dirty) {
    return true
  }

  return window.mora.confirmDiscardChanges({
    fileName: documentState.fileName
  })
}

async function runFileAction(action: () => Promise<void>): Promise<void> {
  try {
    lastError.value = null
    await action()
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unexpected file operation error.'
  }
}

export function useMarkdownDocument() {
  const title = computed(() => documentTitle(documentState.fileName, documentState.dirty))
  const documentStats = computed(() => calculateDocumentStats(documentState.content))

  function setContent(content: string): void {
    applyContentChange(documentState, content)
  }

  function setCursorPosition(position: CursorPosition): void {
    cursorPosition.value = position
  }

  async function newDocument(): Promise<void> {
    await runFileAction(async () => {
      if (await canDiscardCurrentDocument()) {
        applySavedDocument(documentState, null, 'Untitled', '')
      }
    })
  }

  async function openDocument(): Promise<void> {
    await runFileAction(async () => {
      if (!(await canDiscardCurrentDocument())) {
        return
      }

      const result = await window.mora.openFile()

      if (!result.canceled) {
        applySavedDocument(documentState, result.filePath, result.fileName, result.content)
      }
    })
  }

  async function saveDocument(): Promise<void> {
    await runFileAction(async () => {
      if (!documentState.filePath) {
        await saveDocumentAs()
        return
      }

      const result = await window.mora.saveFile({
        filePath: documentState.filePath,
        content: documentState.content
      })

      if (!result.canceled) {
        applySavedDocument(documentState, result.filePath, result.fileName, result.content)
      }
    })
  }

  async function saveDocumentAs(): Promise<void> {
    await runFileAction(async () => {
      const result = await window.mora.saveFileAs({
        currentPath: documentState.filePath,
        content: documentState.content
      })

      if (!result.canceled) {
        applySavedDocument(documentState, result.filePath, result.fileName, result.content)
      }
    })
  }

  async function exportPdfDocument(): Promise<void> {
    if (isExportingPdf.value) {
      return
    }

    try {
      isExportingPdf.value = true

      await runFileAction(async () => {
        await exportMarkdownPdf({
          content: documentState.content,
          fileName: documentState.fileName,
          filePath: documentState.filePath
        })
      })
    } finally {
      isExportingPdf.value = false
    }
  }

  watch(
    () => [documentState.fileName, documentState.dirty] as const,
    () => {
      updateWindowTitle()
      updateDocumentEditedState()
    },
    { immediate: true }
  )

  return {
    documentState,
    title,
    documentStats,
    viewMode,
    cursorPosition,
    lastError,
    isExportingPdf,
    setContent,
    setCursorPosition,
    newDocument,
    openDocument,
    saveDocument,
    saveDocumentAs,
    exportPdfDocument
  }
}
