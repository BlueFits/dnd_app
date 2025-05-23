import { ipcMain } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'

interface Modification {
  role: 'system'
  content: string
}

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

  ipcMain.handle('write-json-file', async (_, filePath: string, data: unknown) => {
    try {
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const fullPath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(basePath, 'app', 'sessions', filePath)
          : join(basePath, filePath)

      await writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error writing JSON file:', error)
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

  // Modification handlers
  ipcMain.handle(
    'save-modifications',
    async (_, sessionId: string, modifications: Modification[]) => {
      try {
        console.log('Saving modifications:', { sessionId, modifications })
        const basePath =
          is.dev && process.env.NODE_ENV === 'development'
            ? join(app.getAppPath(), '..')
            : app.getPath('userData')

        console.log('Base path:', basePath)
        const sessionDir = join(basePath, 'app', 'sessions', sessionId)
        const modFile = join(sessionDir, 'session-001.modification.json')

        console.log('Session dir:', sessionDir)
        console.log('Mod file:', modFile)

        // Ensure sessions directory exists
        if (!fs.existsSync(sessionDir)) {
          console.log('Creating session directory')
          fs.mkdirSync(sessionDir, { recursive: true })
        }

        // Save modifications
        console.log('Writing modifications to file')
        await writeFile(modFile, JSON.stringify(modifications, null, 2), 'utf-8')
        console.log('Modifications saved successfully')
      } catch (error) {
        console.error('Error saving modifications:', error)
        throw error
      }
    }
  )

  ipcMain.handle('load-modifications', async (_, sessionId: string) => {
    try {
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const modFile = join(basePath, 'app', 'sessions', sessionId, 'session-001.modification.json')

      const data = await readFile(modFile, 'utf-8')
      return JSON.parse(data)
    } catch {
      // If file doesn't exist or is invalid, return empty array
      return []
    }
  })
}
