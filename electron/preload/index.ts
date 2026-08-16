import { contextBridge, ipcRenderer } from 'electron'
import type {
  ConfirmDiscardChangesPayload,
  DocumentEditedStatePayload,
  ExportPdfPayload,
  MoraApi,
  SaveFileAsPayload,
  SaveFilePayload
} from '../shared/ipc'

const moraApi: MoraApi = {
  openFile: () => ipcRenderer.invoke('mora:open-file'),
  saveFile: (payload: SaveFilePayload) => ipcRenderer.invoke('mora:save-file', payload),
  saveFileAs: (payload: SaveFileAsPayload) => ipcRenderer.invoke('mora:save-file-as', payload),
  exportPdf: (payload: ExportPdfPayload) => ipcRenderer.invoke('mora:export-pdf', payload),
  confirmDiscardChanges: (payload: ConfirmDiscardChangesPayload) =>
    ipcRenderer.invoke('mora:confirm-discard-changes', payload),
  setDocumentEditedState: (payload: DocumentEditedStatePayload) =>
    ipcRenderer.invoke('mora:set-document-edited-state', payload),
  setWindowTitle: (title: string) => ipcRenderer.invoke('mora:set-window-title', title)
}

contextBridge.exposeInMainWorld('mora', moraApi)
