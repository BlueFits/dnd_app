import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readJsonFile: (filePath: string) => ipcRenderer.invoke('read-json-file', filePath),
  appendToJsonFile: (filePath: string, newData: Record<string, unknown>) =>
    ipcRenderer.invoke('append-to-json-file', filePath, newData),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path')
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
