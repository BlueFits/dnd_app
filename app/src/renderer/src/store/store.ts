import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import playerReducer from './playerSlice'
import notificationReducer from './notificationSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    player: playerReducer,
    notification: notificationReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
