import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addNotification } from './notificationSlice'

// Core player data that gets saved to JSON
interface PlayerData {
  name: string
  level: number
  experience: number
  reputation: string
  traits: string[]
  inventory: string[]
}

// Combined state type
export type PlayerState = PlayerData & {
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const PLAYER_FILE = 'session-001.player.json'

const initialState: PlayerState = {
  // PlayerData properties
  name: '',
  level: 1,
  experience: 0,
  reputation: '',
  traits: [],
  inventory: [],
  // Status properties
  status: 'idle',
  error: null
}

export const loadPlayerData = createAsyncThunk('player/loadData', async (_, { dispatch }) => {
  try {
    const playerData = (await window.api.readJsonFile(PLAYER_FILE)) as PlayerData
    return { ...initialState, ...playerData } as PlayerState
  } catch (error) {
    dispatch(
      addNotification({
        message: error instanceof Error ? error.message : 'Failed to load player data',
        type: 'error'
      })
    )
    throw error
  }
})

export const updatePlayerData = createAsyncThunk(
  'player/updateData',
  async (playerData: Partial<PlayerData>, { getState, dispatch }) => {
    try {
      const currentState = getState() as { player: PlayerState }

      // Handle experience accumulation and level-up logic
      let updatedExperience = currentState.player.experience
      let updatedLevel = currentState.player.level

      if (playerData.experience !== undefined) {
        updatedExperience += playerData.experience
        // Check for level up (100 XP × current level)
        const xpThreshold = 100 * updatedLevel
        if (updatedExperience >= xpThreshold) {
          updatedLevel += 1
          updatedExperience = 0 // Reset experience on level up
        }
      }

      // Only update the PlayerData properties, preserve UI state
      const updatedData = {
        ...currentState.player,
        ...playerData,
        experience: updatedExperience,
        level: updatedLevel,
        // Preserve UI state
        status: currentState.player.status,
        error: currentState.player.error
      }

      // Only save PlayerData properties to JSON
      const jsonData: PlayerData = {
        name: updatedData.name,
        level: updatedData.level,
        experience: updatedData.experience,
        reputation: updatedData.reputation,
        traits: updatedData.traits,
        inventory: updatedData.inventory
      }

      await window.api.writeJsonFile(PLAYER_FILE, jsonData)
      return updatedData
    } catch (error) {
      dispatch(
        addNotification({
          message: error instanceof Error ? error.message : 'Failed to update player data',
          type: 'error'
        })
      )
      throw error
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
