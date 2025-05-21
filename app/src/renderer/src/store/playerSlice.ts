import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface PlayerState {
  name: string
  level: number
  experience: number
  reputation: string
  traits: string[]
  tools: string[]
  environment: string
  last_action: string
  creativity_rating: number
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const PLAYER_FILE = 'session-001.player.json'

const initialState: PlayerState = {
  name: '',
  level: 1,
  experience: 0,
  reputation: '',
  traits: [],
  tools: [],
  environment: '',
  last_action: '',
  creativity_rating: 0,
  status: 'idle',
  error: null
}

export const loadPlayerData = createAsyncThunk('player/loadData', async () => {
  try {
    const playerData = await window.api.readJsonFile(PLAYER_FILE)
    return playerData as PlayerState
  } catch (error) {
    throw new Error(
      `Failed to load player data: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
})

export const updatePlayerData = createAsyncThunk(
  'player/updateData',
  async (playerData: Partial<PlayerState>, { getState }) => {
    try {
      const currentState = getState() as { player: PlayerState }
      const updatedData = { ...currentState.player, ...playerData }
      await window.api.writeJsonFile(PLAYER_FILE, updatedData)
      return updatedData
    } catch (error) {
      throw new Error(
        `Failed to update player data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
)

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPlayerData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadPlayerData.fulfilled, (state, action) => {
        return { ...state, ...action.payload, status: 'idle', error: null }
      })
      .addCase(loadPlayerData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to load player data'
      })
      .addCase(updatePlayerData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updatePlayerData.fulfilled, (state, action) => {
        return { ...state, ...action.payload, status: 'idle', error: null }
      })
      .addCase(updatePlayerData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to update player data'
      })
  }
})

export default playerSlice.reducer
