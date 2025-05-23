import { MusicCategory, AmbienceCategory } from '../types/audio'
import { parseAudioTags } from '../utils/audioParser'

interface TagResponse {
  audio?: {
    music: MusicCategory | null
    ambience: AmbienceCategory | null
  }
  // Add other tag types here as needed
  // example: combat?: { type: string, intensity: number }
  // example: weather?: { type: string, intensity: string }
}

class TagService {
  async generateTags(message: string): Promise<TagResponse> {
    const response = await fetch('http://localhost:3000/llm/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          role: 'assistant',
          content: message
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate tags')
    }

    const content = await response.text()
    return {
      audio: parseAudioTags(content)
    }
  }
}

export const tagService = new TagService()
