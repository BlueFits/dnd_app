interface Window {
  electron: {
    ipcRenderer: {
      send: (channel: string, ...args: unknown[]) => void
      on: (channel: string, func: (...args: unknown[]) => void) => void
      once: (channel: string, func: (...args: unknown[]) => void) => void
    }
  }
  api: {
    readJsonFile: (filePath: string) => Promise<unknown>
  }
}
