import { ipcMain } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'

export function registerFileHandlers(): void {
  ipcMain.handle('read-json-file', async (_, filePath: string) => {
    try {
      // If the path is relative, resolve it from the app's root directory
      const resolvedPath =
        filePath.startsWith('/') || filePath.match(/^[A-Za-z]:/)
          ? filePath
          : join(app.getAppPath(), filePath)

      const data = await readFile(resolvedPath, 'utf-8')
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
        // If the path is relative, resolve it from the app's root directory
        const resolvedPath =
          filePath.startsWith('/') || filePath.match(/^[A-Za-z]:/)
            ? filePath
            : join(app.getAppPath(), filePath)

        // Read existing data
        let existingData: Record<string, unknown>[] = []
        try {
          const data = await readFile(resolvedPath, 'utf-8')
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
        await writeFile(resolvedPath, JSON.stringify(existingData, null, 2), 'utf-8')
        return existingData
      } catch (error) {
        console.error('Error appending to JSON file:', error)
        throw error
      }
    }
  )
}
