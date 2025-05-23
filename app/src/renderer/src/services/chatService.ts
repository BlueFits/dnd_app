import { Message } from '../types/chat'
import { PlayerState } from '../store/playerSlice'
import { Modification } from '../store/modificationsSlice'

export const chatService = {
  async sendMessage(
    messages: Message[],
    player: PlayerState,
    modifications: Modification[]
  ): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const response = await fetch('http://localhost:3000/llm/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        player,
        modifications
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    return response.body.getReader()
  },

  async updatePlayerData(
    message: Message,
    player: PlayerState,
    modifications: Modification[]
  ): Promise<PlayerState> {
    const response = await fetch('http://localhost:3000/llm/player-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: message,
        player,
        modifications
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to update player data: ${response.status}`)
    }

    return response.json()
  }
}
