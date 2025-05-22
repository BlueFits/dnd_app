import { Box, Typography } from '@mui/material'
import ExtensionIcon from '@mui/icons-material/Extension'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import VideoSettingsIcon from '@mui/icons-material/VideoSettings'
import { MenuButton } from '../styles'
import { NavigationProps } from '../types'

export const MainScreen = ({ onNavigate }: NavigationProps): React.JSX.Element => (
  <Box>
    <MenuButton onClick={() => onNavigate('modifications')}>
      <ExtensionIcon sx={{ fontSize: '1.5rem' }} />
      <Typography variant="body2">Manage Modifications</Typography>
    </MenuButton>
    <MenuButton onClick={() => onNavigate('music')}>
      <MusicNoteIcon />
      <Typography variant="body2">Music Settings</Typography>
    </MenuButton>
    <MenuButton onClick={() => onNavigate('video')}>
      <VideoSettingsIcon />
      <Typography variant="body2">Video Settings</Typography>
    </MenuButton>
  </Box>
)
