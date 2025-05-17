import { ipcMain } from 'electron'
import { app } from 'electron'

export function registerAppHandlers(): void {
  ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData')
  })
}
