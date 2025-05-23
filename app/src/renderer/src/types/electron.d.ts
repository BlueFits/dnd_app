import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      readJsonFile: (filePath: string) => Promise<unknown>
      appendToJsonFile: (filePath: string, newData: Record<string, unknown>) => Promise<unknown>
      writeJsonFile: (filePath: string, data: unknown) => Promise<void>
      getUserDataPath: () => Promise<string>
      saveModifications: (sessionId: string, modifications: unknown[]) => Promise<void>
      loadModifications: (sessionId: string) => Promise<unknown[]>
    }
  }
}
