import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readJsonFile: (sessionId: string, fileType?: string) =>
    ipcRenderer.invoke('read-json-file', sessionId, fileType),
  appendToJsonFile: (sessionId: string, newData: Record<string, unknown>, fileType?: string) =>
    ipcRenderer.invoke('append-to-json-file', sessionId, newData, fileType),
  writeJsonFile: (sessionId: string, data: unknown, fileType?: string) =>
    ipcRenderer.invoke('write-json-file', sessionId, data, fileType),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  saveModifications: (sessionId: string, modifications: unknown[]) =>
    ipcRenderer.invoke('save-modifications', sessionId, modifications),
  loadModifications: (sessionId: string) =>
    ipcRenderer.invoke('load-modifications', sessionId)
} as const

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
