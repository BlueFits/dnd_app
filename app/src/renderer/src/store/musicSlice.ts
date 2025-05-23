import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MusicCategory, AmbienceCategory } from '../types/audio'

interface MusicState {
  currentMusic: MusicCategory | null
  currentAmbience: AmbienceCategory | null
  isMusicPlaying: boolean
  isAmbiencePlaying: boolean
  volume: {
    music: number
    ambience: number
  }
}

const initialState: MusicState = {
  currentMusic: null,
  currentAmbience: null,
  isMusicPlaying: false,
  isAmbiencePlaying: false,
  volume: {
    music: 0.5,
    ambience: 0.5
  }
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setMusic: (state, action: PayloadAction<MusicCategory | null>) => {
      state.currentMusic = action.payload
      state.isMusicPlaying = !!action.payload
    },
    setAmbience: (state, action: PayloadAction<AmbienceCategory | null>) => {
      state.currentAmbience = action.payload
      state.isAmbiencePlaying = !!action.payload
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.volume.music = action.payload
    },
    setAmbienceVolume: (state, action: PayloadAction<number>) => {
      state.volume.ambience = action.payload
    },
    stopMusic: (state) => {
      state.currentMusic = null
      state.isMusicPlaying = false
    },
    stopAmbience: (state) => {
      state.currentAmbience = null
      state.isAmbiencePlaying = false
    }
  }
})

export const { setMusic, setAmbience, setMusicVolume, setAmbienceVolume, stopMusic, stopAmbience } =
  musicSlice.actions

export default musicSlice.reducer
