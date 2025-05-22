import { DialogTitle, DialogContent, Typography, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { StyledDialog } from '../common/StyledDialog'
import { useState } from 'react'
import type { SettingsModalProps, SettingsScreen } from './types'
import { ContentContainer } from './styles'
import {
  MainScreen,
  ModificationsScreen,
  AddModificationScreen,
  MusicScreen,
  VideoScreen
} from './screens'

const ModalHeader = ({
  currentScreen,
  onBack,
  onClose
}: {
  currentScreen: SettingsScreen
  onBack: () => void
  onClose: () => void
}): React.JSX.Element => (
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {currentScreen !== 'main' && (
        <IconButton onClick={onBack} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography variant="h5" component="div">
        {currentScreen === 'main'
          ? 'Settings'
          : currentScreen
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
      </Typography>
    </Box>
    <IconButton onClick={onClose} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>
)

const SettingsScreen = ({
  screen,
  onNavigate
}: {
  screen: SettingsScreen
  onNavigate: (screen: SettingsScreen) => void
}): React.JSX.Element => {
  switch (screen) {
    case 'modifications':
      return <ModificationsScreen onNavigate={onNavigate} />
    case 'add-modification':
      return <AddModificationScreen />
    case 'music':
      return <MusicScreen />
    case 'video':
      return <VideoScreen />
    default:
      return <MainScreen onNavigate={onNavigate} />
  }
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps): React.JSX.Element => {
  const [navigationStack, setNavigationStack] = useState<SettingsScreen[]>(['main'])

  const handleNavigate = (screen: SettingsScreen): void => {
    setNavigationStack((prev) => [...prev, screen])
  }

  const handleBack = (): void => {
    setNavigationStack((prev) => prev.slice(0, -1))
  }

  const currentScreen = navigationStack[navigationStack.length - 1]

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalHeader currentScreen={currentScreen} onBack={handleBack} onClose={onClose} />
      <DialogContent>
        <ContentContainer>
          <Box sx={{ mt: 2 }}>
            <SettingsScreen screen={currentScreen} onNavigate={handleNavigate} />
          </Box>
        </ContentContainer>
      </DialogContent>
    </StyledDialog>
  )
}
