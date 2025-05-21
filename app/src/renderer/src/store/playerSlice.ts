import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Core player data that gets saved to JSON
interface PlayerData {
  name: string
  level: number
  experience: number
  reputation: string
  traits: string[]
  inventory: string[]
}

// UI-specific properties that shouldn't be saved to JSON
interface UIState {
  tools: string[]
  environment: string
  last_action: string
  creativity_rating: number
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

// Combined state type
export type PlayerState = PlayerData & UIState

const PLAYER_FILE = 'session-001.player.json'

const initialState: PlayerState = {
  // PlayerData properties
  name: '',
  level: 1,
  experience: 0,
  reputation: '',
  traits: [],
  inventory: [],
  // UI-specific properties
  tools: [],
  environment: '',
  last_action: '',
  creativity_rating: 0,
  status: 'idle',
  error: null
}

export const loadPlayerData = createAsyncThunk('player/loadData', async () => {
  try {
    const playerData = await window.api.readJsonFile(PLAYER_FILE) as PlayerData
    return { ...initialState, ...playerData } as PlayerState
  } catch (error) {
    throw new Error(
      `Failed to load player data: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
})

export const updatePlayerData = createAsyncThunk(
  'player/updateData',
  async (playerData: Partial<PlayerData>, { getState }) => {
    try {
      console.log("!!!", playerData)
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
        tools: currentState.player.tools,
        environment: currentState.player.environment,
        last_action: currentState.player.last_action,
        creativity_rating: currentState.player.creativity_rating,
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
