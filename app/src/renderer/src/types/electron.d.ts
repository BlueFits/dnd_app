import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomElectronAPI {
  readJsonFile: (sessionId: string, fileType?: string) => Promise<unknown>
  appendToJsonFile: (sessionId: string, newData: Record<string, unknown>, fileType?: string) => Promise<unknown>
  writeJsonFile: (sessionId: string, data: unknown, fileType?: string) => Promise<void>
  getUserDataPath: () => Promise<string>
  saveModifications: (sessionId: string, modifications: unknown[]) => Promise<void>
  loadModifications: (sessionId: string) => Promise<unknown[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomElectronAPI
  }
}
