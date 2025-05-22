import {
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Button,
  Slide
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import VideoSettingsIcon from '@mui/icons-material/VideoSettings'
import ExtensionIcon from '@mui/icons-material/Extension'
import { StyledDialog } from '../common/StyledDialog'
import { useState, useEffect, useRef } from 'react'

// Types
type SettingsScreen = 'main' | 'modifications' | 'music' | 'video'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

interface SettingsScreenProps {
  screen: SettingsScreen
  onNavigate: (screen: SettingsScreen) => void
}

// Styled Components
const MenuButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(2)
}))

const ContentContainer = styled(Box)({
  width: '100%',
  minHeight: '300px',
  position: 'relative',
  overflow: 'hidden'
})

// Constants
const ANIMATION_DURATION = 400

// Components
const ModificationsScreen = (): React.JSX.Element => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Modifications
    </Typography>
    <Typography variant="body2" color="text.secondary">
      No modifications installed
    </Typography>
  </Box>
)

const MusicScreen = (): React.JSX.Element => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Music Settings
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Music settings coming soon
    </Typography>
  </Box>
)

const VideoScreen = (): React.JSX.Element => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Video Settings
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Video settings coming soon
    </Typography>
  </Box>
)

const MainScreen = ({
  onNavigate
}: {
  onNavigate: (screen: SettingsScreen) => void
}): React.JSX.Element => (
  <Box>
    <MenuButton onClick={() => onNavigate('modifications')}>
      <ExtensionIcon />
      <Typography>Add Modifications</Typography>
    </MenuButton>
    <MenuButton onClick={() => onNavigate('music')}>
      <MusicNoteIcon />
      <Typography>Music Settings</Typography>
    </MenuButton>
    <MenuButton onClick={() => onNavigate('video')}>
      <VideoSettingsIcon />
      <Typography>Video Settings</Typography>
    </MenuButton>
  </Box>
)

const SettingsScreen = ({ screen, onNavigate }: SettingsScreenProps): React.JSX.Element => {
  switch (screen) {
    case 'modifications':
      return <ModificationsScreen />
    case 'music':
      return <MusicScreen />
    case 'video':
      return <VideoScreen />
    default:
      return <MainScreen onNavigate={onNavigate} />
  }
}

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
          : currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}
      </Typography>
    </Box>
    <IconButton onClick={onClose} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>
)

export const SettingsModal = ({ open, onClose }: SettingsModalProps): React.JSX.Element => {
  // State
  const [currentScreen, setCurrentScreen] = useState<SettingsScreen>('main')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')
  const isFirstRender = useRef(true)

  // Effects
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setCurrentScreen('main')
        setSlideDirection('left')
        isFirstRender.current = true
      }, ANIMATION_DURATION)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [open])

  // Handlers
  const handleNavigate = (screen: SettingsScreen): void => {
    isFirstRender.current = false
    setSlideDirection('left')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentScreen(screen)
      setIsTransitioning(false)
    }, ANIMATION_DURATION)
  }

  const handleBack = (): void => {
    isFirstRender.current = false
    setSlideDirection('right')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentScreen('main')
      setIsTransitioning(false)
    }, ANIMATION_DURATION)
  }

  // Render
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalHeader currentScreen={currentScreen} onBack={handleBack} onClose={onClose} />
      <DialogContent sx={{ overflowX: 'hidden' }}>
        <ContentContainer>
          {isFirstRender.current ? (
            <Box sx={{ mt: 2 }}>
              <SettingsScreen screen={currentScreen} onNavigate={handleNavigate} />
            </Box>
          ) : (
            <Slide
              direction={slideDirection}
              in={!isTransitioning}
              mountOnEnter
              unmountOnExit
              timeout={ANIMATION_DURATION}
            >
              <Box sx={{ mt: 2 }}>
                <SettingsScreen screen={currentScreen} onNavigate={handleNavigate} />
              </Box>
            </Slide>
          )}
        </ContentContainer>
      </DialogContent>
    </StyledDialog>
  )
}
