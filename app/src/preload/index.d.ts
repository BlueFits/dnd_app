import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      readJsonFile: (filePath: string) => Promise<unknown>
      appendToJsonFile: (filePath: string, newData: Record<string, unknown>) => Promise<unknown>
      getUserDataPath: () => Promise<string>
    }
  }
}
