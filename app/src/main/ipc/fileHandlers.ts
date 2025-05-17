import { ipcMain } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

export function registerFileHandlers(): void {
  ipcMain.handle('read-json-file', async (_, filePath: string) => {
    try {
      // In development, use the project's sessions folder
      // In production (npm start or built app), use userData
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const fullPath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(basePath, 'app', 'sessions', filePath)
          : join(basePath, filePath)

      const data = await readFile(fullPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading JSON file:', error)
      throw error
    }
  })

  ipcMain.handle(
    'append-to-json-file',
    async (_, filePath: string, newData: Record<string, unknown>) => {
      try {
        // In development, use the project's sessions folder
        // In production (npm start or built app), use userData
        const basePath =
          is.dev && process.env.NODE_ENV === 'development'
            ? join(app.getAppPath(), '..')
            : app.getPath('userData')

        const fullPath =
          is.dev && process.env.NODE_ENV === 'development'
            ? join(basePath, 'app', 'sessions', filePath)
            : join(basePath, filePath)

        // Read existing data
        let existingData: Record<string, unknown>[] = []
        try {
          const data = await readFile(fullPath, 'utf-8')
          existingData = JSON.parse(data)
        } catch {
          // If file doesn't exist or is empty, start with empty array
          console.log('No existing file or empty file, starting fresh')
        }

        // Ensure existingData is an array
        if (!Array.isArray(existingData)) {
          existingData = []
        }

        // Append new data
        existingData.push(newData)

        // Write back to file
        await writeFile(fullPath, JSON.stringify(existingData, null, 2), 'utf-8')
        return existingData
      } catch (error) {
        console.error('Error appending to JSON file:', error)
        throw error
      }
    }
  )
}
