import { configureStore, Store } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import playerReducer from './playerSlice'
import notificationReducer from './notificationSlice'
import modificationsReducer from './modificationsSlice'
import musicReducer from './musicSlice'

const store: Store = configureStore({
  reducer: {
    chat: chatReducer,
    player: playerReducer,
    notification: notificationReducer,
    modifications: modificationsReducer,
    music: musicReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export { store }
