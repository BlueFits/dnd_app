export type SettingsScreen = 'main' | 'modifications' | 'music' | 'video' | 'add-modification'

export interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export interface NavigationProps {
  onNavigate: (screen: SettingsScreen) => void
}
