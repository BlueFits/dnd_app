import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationType = 'error' | 'success' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: number
}

export interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: []
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ message: string; type: NotificationType }>
    ) => {
      state.notifications.push({
        id: Math.random().toString(36).substr(2, 9),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now()
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
