import { Box, Typography, Slider, IconButton, Stack, Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store/store'
import {
  setMusicVolume,
  setAmbienceVolume,
  stopMusic,
  stopAmbience
} from '../../../store/musicSlice'
import { audioService } from '../../../services/audioService'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import StopIcon from '@mui/icons-material/Stop'

export const MusicScreen = (): React.JSX.Element => {
  const dispatch = useDispatch()
  const { currentMusic, currentAmbience, volume } = useSelector((state: RootState) => state.music)

  const handleMusicVolumeChange = (_event: Event, newValue: number | number[]): void => {
    const volume = newValue as number
    dispatch(setMusicVolume(volume))
    audioService.setMusicVolume(volume)
  }

  const handleAmbienceVolumeChange = (_event: Event, newValue: number | number[]): void => {
    const volume = newValue as number
    dispatch(setAmbienceVolume(volume))
    audioService.setAmbienceVolume(volume)
  }

  const handleStopMusic = (): void => {
    dispatch(stopMusic())
    audioService.stopMusic()
  }

  const handleStopAmbience = (): void => {
    dispatch(stopAmbience())
    audioService.stopAmbience()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Music Settings
      </Typography>

      <Stack spacing={4}>
        {/* Music Controls */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Music
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current: {currentMusic || 'None'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<StopIcon />}
              onClick={handleStopMusic}
              disabled={!currentMusic}
            >
              Stop
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>{volume.music > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}</IconButton>
            <Slider
              value={volume.music}
              onChange={handleMusicVolumeChange}
              min={0}
              max={1}
              step={0.1}
              sx={{ width: 200 }}
            />
            <Typography variant="body2">{Math.round(volume.music * 100)}%</Typography>
          </Box>
        </Box>

        {/* Ambience Controls */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Ambience
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current: {currentAmbience || 'None'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<StopIcon />}
              onClick={handleStopAmbience}
              disabled={!currentAmbience}
            >
              Stop
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>{volume.ambience > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}</IconButton>
            <Slider
              value={volume.ambience}
              onChange={handleAmbienceVolumeChange}
              min={0}
              max={1}
              step={0.1}
              sx={{ width: 200 }}
            />
            <Typography variant="body2">{Math.round(volume.ambience * 100)}%</Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
