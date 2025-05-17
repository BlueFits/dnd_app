import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatState {
  messages: Message[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  error: null
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as { chat: ChatState }
    const messages = [...state.chat.messages, { role: 'user', content: message }]

    try {
      const response = await fetch('http://localhost:3000/openai/chat', {
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
          }
        }
      }

      // Save to JSON file
      await window.api.appendToJsonFile('sessions/session-001.json', {
        role: 'user',
        content: message
      })
      await window.api.appendToJsonFile('sessions/session-001.json', {
        role: 'assistant',
        content: assistantMessage
      })

      return {
        userMessage: { role: 'user' as const, content: message },
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
    const messages = await window.api.readJsonFile('sessions/session-001.json')
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'idle'
        state.messages.push(action.payload.userMessage)
        state.messages.push(action.payload.assistantMessage)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to send message'
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
  }
})

export default chatSlice.reducer
