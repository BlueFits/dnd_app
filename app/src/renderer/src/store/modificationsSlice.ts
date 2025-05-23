import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from './store'
import { saveModifications, loadModifications } from '../services/modificationService'

export interface Modification {
  role: 'system'
  content: string
}

interface ModificationsState {
  modifications: Modification[]
  sessionId: string | null
  status: 'idle' | 'loading' | 'saving' | 'failed'
  error: string | null
}

const initialState: ModificationsState = {
  modifications: [],
  sessionId: null,
  status: 'idle',
  error: null
}

export const saveModificationsAsync = createAsyncThunk(
  'modifications/save',
  async ({ sessionId, modifications }: { sessionId: string; modifications: Modification[] }) => {
    console.log(sessionId, modifications)
    await saveModifications(sessionId, modifications)
    return modifications
  }
)

export const loadModificationsAsync = createAsyncThunk(
  'modifications/load',
  async (sessionId: string) => {
    return await loadModifications(sessionId)
  }
)

export const modificationsSlice = createSlice({
  name: 'modifications',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveModificationsAsync.pending, (state) => {
        state.status = 'saving'
      })
      .addCase(saveModificationsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.modifications = action.payload
      })
      .addCase(saveModificationsAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to save modifications'
      })
      .addCase(loadModificationsAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadModificationsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.modifications = action.payload
      })
      .addCase(loadModificationsAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to load modifications'
      })
  }
})

export const { setSessionId } = modificationsSlice.actions

export const selectModifications = (state: RootState): Modification[] => state.modifications.modifications
export const selectSessionId = (state: RootState): string | null => state.modifications.sessionId

export default modificationsSlice.reducer
