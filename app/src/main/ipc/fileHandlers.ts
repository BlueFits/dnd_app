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

function getSessionPath(basePath: string, filePath: string): string {
  // Extract session ID from filename (e.g., 'session-001.player.json' -> 'session-001')
  const sessionId = filePath.split('.')[0]

  // If the file is a session file (starts with 'session-'), put it in the session directory
  if (filePath.startsWith('session-')) {
    return is.dev && process.env.NODE_ENV === 'development'
      ? join(basePath, 'app', 'sessions', sessionId, filePath)
      : join(basePath, sessionId, filePath)
  }

  // Otherwise, keep it in the sessions root
  return is.dev && process.env.NODE_ENV === 'development'
    ? join(basePath, 'app', 'sessions', filePath)
    : join(basePath, filePath)
}

export function registerFileHandlers(): void {
  ipcMain.handle('read-json-file', async (_, filePath: string) => {
    try {
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const fullPath = getSessionPath(basePath, filePath)

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

      const fullPath = getSessionPath(basePath, filePath)

      // Ensure the directory exists
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

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
        const basePath =
          is.dev && process.env.NODE_ENV === 'development'
            ? join(app.getAppPath(), '..')
            : app.getPath('userData')

        const fullPath = getSessionPath(basePath, filePath)

        // Ensure the directory exists
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

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

        const modFile = is.dev && process.env.NODE_ENV === 'development'
          ? join(basePath, 'app', 'sessions', sessionId, `${sessionId}.modification.json`)
          : join(basePath, sessionId, `${sessionId}.modification.json`)

        // Ensure sessions directory exists
        const sessionDir = is.dev && process.env.NODE_ENV === 'development'
          ? join(basePath, 'app', 'sessions', sessionId)
          : join(basePath, sessionId)

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

      const modFile = is.dev && process.env.NODE_ENV === 'development'
        ? join(basePath, 'app', 'sessions', sessionId, `${sessionId}.modification.json`)
        : join(basePath, sessionId, `${sessionId}.modification.json`)

      const data = await readFile(modFile, 'utf-8')
      return JSON.parse(data)
    } catch {
      // If file doesn't exist or is invalid, return empty array
      return []
    }
  })
}
