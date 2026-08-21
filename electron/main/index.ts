import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron'
import type { OpenDialogOptions, SaveDialogOptions } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join } from 'node:path'
import type {
  ConfirmDiscardChangesPayload,
  DocumentEditedStatePayload,
  ExportPdfPayload,
  ExportPdfResult,
  OpenFileResult,
  SaveFileAsPayload,
  SaveFilePayload,
  SaveFileResult
} from '../shared/ipc'
import { exportPdf } from './pdf'
import { appIconPath } from './paths'

let mainWindow: BrowserWindow | null = null
let documentEditedState: DocumentEditedStatePayload = {
  fileName: 'Untitled',
  dirty: false
}

async function confirmDiscardChanges(
  payload: ConfirmDiscardChangesPayload,
  parentWindow: BrowserWindow | null
): Promise<boolean> {
  const fileName = payload.fileName.trim() || 'Untitled'
  const result = parentWindow
    ? await dialog.showMessageBox(parentWindow, {
        type: 'warning',
        buttons: ['Discard Changes', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
        title: 'Discard unsaved changes?',
        message: `Discard unsaved changes to ${fileName}?`,
        detail: 'Your current edits will be lost if you continue.'
      })
    : await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Discard Changes', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
        title: 'Discard unsaved changes?',
        message: `Discard unsaved changes to ${fileName}?`,
        detail: 'Your current edits will be lost if you continue.'
      })

  return result.response === 0
}

function createWindow(): void {
  const rendererUrl = process.env.ELECTRON_RENDERER_URL
  const window = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 860,
    minHeight: 560,
    title: 'Untitled - Mora',
    icon: appIconPath(),
    backgroundColor: '#fbfaf8',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  let closeConfirmed = false
  let closeConfirmationPending = false
  mainWindow = window

  if (!app.isPackaged && rendererUrl) {
    void window.loadURL(rendererUrl)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url)
    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    if (url === window.webContents.getURL()) {
      return
    }

    event.preventDefault()
    openExternalUrl(url)
  })

  window.on('close', (event) => {
    if (closeConfirmed || !documentEditedState.dirty) {
      return
    }

    event.preventDefault()

    if (closeConfirmationPending) {
      return
    }

    closeConfirmationPending = true

    void confirmDiscardChanges({ fileName: documentEditedState.fileName }, window)
      .then((confirmed) => {
        if (!confirmed || window.isDestroyed()) {
          return
        }

        closeConfirmed = true
        documentEditedState = {
          fileName: 'Untitled',
          dirty: false
        }
        window.close()
      })
      .finally(() => {
        closeConfirmationPending = false
      })
  })

  window.on('closed', () => {
    if (mainWindow === window) {
      mainWindow = null
    }
  })
}

function isMarkdownPath(filePath: string): boolean {
  const extension = extname(filePath).toLowerCase()
  return extension === '.md' || extension === '.markdown'
}

function fileNameFromPath(filePath: string): string {
  return basename(filePath) || 'Untitled.md'
}

function ensureMarkdownExtension(filePath: string): string {
  if (isMarkdownPath(filePath)) {
    return filePath
  }

  const extension = extname(filePath)
  if (!extension) {
    return `${filePath}.md`
  }

  return join(dirname(filePath), `${basename(filePath, extension)}.md`)
}

function defaultSaveDialogPath(filePath: string | null | undefined, fallbackFileName: string): string {
  const candidate = filePath?.trim() || fallbackFileName
  return isAbsolute(candidate) ? candidate : join(app.getPath('documents'), candidate)
}

function canOpenExternally(url: string): boolean {
  return /^(https?|mailto):/i.test(url)
}

function openExternalUrl(url: string): void {
  if (canOpenExternally(url)) {
    void shell.openExternal(url)
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('mora:open-file', async (): Promise<OpenFileResult> => {
    const options: OpenDialogOptions = {
      title: 'Open Markdown File',
      properties: ['openFile'],
      filters: [
        {
          name: 'Markdown',
          extensions: ['md', 'markdown']
        }
      ]
    }
    const result = mainWindow ? await dialog.showOpenDialog(mainWindow, options) : await dialog.showOpenDialog(options)

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true }
    }

    const filePath = result.filePaths[0]
    if (!isMarkdownPath(filePath)) {
      throw new Error('Only .md and .markdown files can be opened.')
    }

    const content = await readFile(filePath, 'utf8')
    return {
      canceled: false,
      filePath,
      fileName: fileNameFromPath(filePath),
      content
    }
  })

  ipcMain.handle('mora:save-file', async (_event, payload: SaveFilePayload): Promise<SaveFileResult> => {
    if (!isMarkdownPath(payload.filePath)) {
      throw new Error('Only .md and .markdown files can be saved.')
    }

    await writeFile(payload.filePath, payload.content, 'utf8')
    return {
      canceled: false,
      filePath: payload.filePath,
      fileName: fileNameFromPath(payload.filePath),
      content: payload.content
    }
  })

  ipcMain.handle('mora:save-file-as', async (_event, payload: SaveFileAsPayload): Promise<SaveFileResult> => {
    const options: SaveDialogOptions = {
      title: 'Save Markdown File',
      defaultPath: defaultSaveDialogPath(payload.currentPath, 'Untitled.md'),
      filters: [
        {
          name: 'Markdown',
          extensions: ['md']
        }
      ]
    }
    const result = mainWindow ? await dialog.showSaveDialog(mainWindow, options) : await dialog.showSaveDialog(options)

    if (result.canceled || !result.filePath) {
      return { canceled: true }
    }

    const filePath = ensureMarkdownExtension(result.filePath)
    await writeFile(filePath, payload.content, 'utf8')
    return {
      canceled: false,
      filePath,
      fileName: fileNameFromPath(filePath),
      content: payload.content
    }
  })

  ipcMain.handle('mora:export-pdf', async (_event, payload: ExportPdfPayload): Promise<ExportPdfResult> => {
    try {
      return await exportPdf(payload, mainWindow)
    } catch (error) {
      console.error('Failed to export PDF.', error)
      throw new Error('Failed to export PDF.', { cause: error })
    }
  })

  ipcMain.handle('mora:confirm-discard-changes', (_event, payload: ConfirmDiscardChangesPayload): Promise<boolean> => {
    return confirmDiscardChanges(payload, mainWindow)
  })

  ipcMain.handle('mora:set-document-edited-state', (_event, payload: DocumentEditedStatePayload): void => {
    documentEditedState = {
      fileName: payload.fileName.trim() || 'Untitled',
      dirty: payload.dirty
    }
    mainWindow?.setDocumentEdited(payload.dirty)
  })

  ipcMain.handle('mora:set-window-title', (_event, title: string): void => {
    mainWindow?.setTitle(title)
  })
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
