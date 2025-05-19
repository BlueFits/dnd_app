import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatState {
  messages: Message[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
  streamingContent: string
}

const SESSION_FILE = 'session-001.json'

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null,
  streamingContent: ''
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState, dispatch }) => {
    const state = getState() as { chat: ChatState }
    const userMessage = { role: 'user' as const, content: message }

    // Add user message to state immediately
    dispatch(chatSlice.actions.addMessage(userMessage))

    const messages = [...state.chat.messages, userMessage]

    try {
      const response = await fetch('http://localhost:3000/llm/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (!reader) {
        throw new Error('Failed to get response reader')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            assistantMessage += data.content
            dispatch(chatSlice.actions.updateStreamingContent(assistantMessage))
          }
        }
      }

      // Save to JSON file in user data directory
      await window.api.appendToJsonFile(SESSION_FILE, userMessage)
      await window.api.appendToJsonFile(SESSION_FILE, {
        role: 'assistant',
        content: assistantMessage
      })

      return {
        assistantMessage: { role: 'assistant' as const, content: assistantMessage }
      }
    } catch (error) {
      throw new Error(
        `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
)

export const loadMessages = createAsyncThunk('chat/loadMessages', async () => {
  try {
    const messages = await window.api.readJsonFile(SESSION_FILE)
    return messages as Message[]
  } catch (error) {
    throw new Error(
      `Failed to load messages: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
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
