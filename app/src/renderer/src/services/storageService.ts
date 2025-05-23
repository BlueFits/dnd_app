import { Message } from '../types/chat'
import { PlayerData } from '../store/playerSlice'

const SESSION_ID = 'session-001'

export const storageService = {
  async appendToJsonFile(data: Message): Promise<void> {
    await window.api.appendToJsonFile(SESSION_ID, data as Record<string, unknown>)
  },

  async readJsonFile(): Promise<Message[]> {
    return window.api.readJsonFile(SESSION_ID) as Promise<Message[]>
  },

  async readPlayerData(): Promise<PlayerData> {
    return window.api.readJsonFile(SESSION_ID, 'player') as Promise<PlayerData>
  },

  async writePlayerData(data: PlayerData): Promise<void> {
    await window.api.writeJsonFile(SESSION_ID, data, 'player')
  }
}
