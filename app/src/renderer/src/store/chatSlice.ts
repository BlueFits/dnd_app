import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updatePlayerData } from './playerSlice'
import { addNotification } from './notificationSlice'
import { RootState } from './store'
import { Message } from '../types/chat'
import { chatService } from '../services/chatService'
import { storageService } from '../services/storageService'
import { parseAudioTags } from '../utils/audioParser'
import { setMusic, setAmbience } from './musicSlice'
import { audioService } from '../services/audioService'

// Helper function to remove audio tags from message content
const removeAudioTags = (content: string): string => {
  return content.replace(/\[(?:MUSIC|AMBIENCE):[^\]]+\]/g, '').trim()
}

export interface ChatState {
  messages: Message[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
  streamingContent: string
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
  streamingContent: ''
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState, dispatch }) => {
    const state = getState() as RootState
    const userMessage = { role: 'user' as const, content: message }

    // Add user message to state immediately
    dispatch(chatSlice.actions.addMessage(userMessage))

    const messages = [...state.chat.messages, userMessage]

    try {
      const reader = await chatService.sendMessage(
        messages,
        state.player,
        state.modifications.modifications
      )
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            assistantMessage += data.content
            // Clean the streaming content before updating the state
            const cleanedStreamingContent = removeAudioTags(assistantMessage)
            dispatch(chatSlice.actions.updateStreamingContent(cleanedStreamingContent))
          }
        }
      }

      // Parse and handle audio tags
      const { music, ambience } = parseAudioTags(assistantMessage)

      console.log("parsing", music, ambience)

      // Handle music - only change if a new music tag is provided
      if (music && music !== state.music.currentMusic) {
        dispatch(setMusic(music))
        audioService.playMusic(music, state.music.volume.music)
      }

      // Handle ambience - only change if a new ambience tag is provided
      if (ambience && ambience !== state.music.currentAmbience) {
        dispatch(setAmbience(ambience))
        audioService.playAmbience(ambience, state.music.volume.ambience)
      }

      // Clean the message content before storing
      const cleanedMessage = removeAudioTags(assistantMessage)

      // After getting assistant message, update player data
      const updatedPlayer = await chatService.updatePlayerData(
        { role: 'assistant', content: assistantMessage },
        state.player,
        state.modifications.modifications
      )

      // Update player state with new data
      dispatch(updatePlayerData(updatedPlayer))

      // Save messages to storage
      await storageService.appendToJsonFile(userMessage)
      await storageService.appendToJsonFile({
        role: 'assistant',
        content: cleanedMessage
      })

      return {
        assistantMessage: { role: 'assistant' as const, content: cleanedMessage }
      }
    } catch (error) {
      dispatch(
        addNotification({
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          type: 'error'
        })
      )
      throw error
    }
  }
)

export const loadMessages = createAsyncThunk('chat/loadMessages', async (_, { dispatch }) => {
  try {
    return await storageService.readJsonFile()
  } catch (error) {
    dispatch(
      addNotification({
        message: error instanceof Error ? error.message : 'Failed to load messages',
        type: 'error'
      })
    )
    throw error
  }
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateStreamingContent: (state, action) => {
      state.streamingContent = action.payload
    },
    clearStreamingContent: (state) => {
      state.streamingContent = ''
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading'
        state.streamingContent = ''
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'idle'
        state.messages.push(action.payload.assistantMessage)
        state.streamingContent = ''
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to send message'
        state.streamingContent = ''
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
  }
})

export const { updateStreamingContent, clearStreamingContent, addMessage } = chatSlice.actions
export default chatSlice.reducer
