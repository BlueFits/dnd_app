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

function getSessionPath(basePath: string, sessionId: string, fileType?: string): string {
  // Ensure sessionId doesn't already have .json extension
  const cleanSessionId = sessionId.replace('.json', '')

  // Construct filename based on file type
  const filename = fileType ? `${cleanSessionId}.${fileType}.json` : `${cleanSessionId}.json`

  // Construct the path with appropriate filename
  return is.dev && process.env.NODE_ENV === 'development'
    ? join(basePath, 'app', 'sessions', cleanSessionId, filename)
    : join(basePath, cleanSessionId, filename)
}

export function registerFileHandlers(): void {
  ipcMain.handle('read-json-file', async (_, sessionId: string, fileType?: string) => {
    try {
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const fullPath = getSessionPath(basePath, sessionId, fileType)

      const data = await readFile(fullPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading JSON file:', error)
      throw error
    }
  })

  ipcMain.handle('write-json-file', async (_, sessionId: string, data: unknown, fileType?: string) => {
    try {
      const basePath =
        is.dev && process.env.NODE_ENV === 'development'
          ? join(app.getAppPath(), '..')
          : app.getPath('userData')

      const fullPath = getSessionPath(basePath, sessionId, fileType)

      // Ensure the directory exists
      const dir = fullPath.substring(0, fullPath.lastIndexOf('\\') || fullPath.lastIndexOf('/'))
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
    async (_, sessionId: string, newData: Record<string, unknown>, fileType?: string) => {
      try {
        const basePath =
          is.dev && process.env.NODE_ENV === 'development'
            ? join(app.getAppPath(), '..')
            : app.getPath('userData')

        const fullPath = getSessionPath(basePath, sessionId, fileType)

        // Ensure the directory exists
        const dir = fullPath.substring(0, fullPath.lastIndexOf('\\') || fullPath.lastIndexOf('/'))
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
          fs.mkdirSync(sessionDir, { recursive: true })
        }

        // Save modifications
        await writeFile(modFile, JSON.stringify(modifications, null, 2), 'utf-8')
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
