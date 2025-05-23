import { Box, Typography, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { StyledButton } from '../styles'
import { useDispatch, useSelector } from 'react-redux'
import { saveModificationsAsync } from '../../../store/modificationsSlice'
import { NavigationProps } from '../types'
import { RootState, AppDispatch } from '../../../store/store'

export const AddModificationScreen = ({ onNavigate }: NavigationProps): React.JSX.Element => {
  const [modificationContent, setModificationContent] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const { modifications, sessionId } = useSelector((state: RootState) => state.modifications)

  const handleSubmit = async (): Promise<void> => {
    if (modificationContent.trim() && sessionId) {
      const newModification = {
        role: 'system' as const,
        content: modificationContent.trim()
      }
      await dispatch(
        saveModificationsAsync({
          sessionId,
          modifications: [...modifications, newModification]
        })
      )
      onNavigate('modifications')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6">Add Modification</Typography>
      <Typography variant="body2" color="text.secondary">
        Enter a modification or rule you want to set in your universe
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 2
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          placeholder="Enter your modification or rule here..."
          value={modificationContent}
          onChange={(e) => setModificationContent(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '& textarea': {
                padding: '16px'
              }
            }
          }}
        />
        <Box sx={{ marginTop: 2 }}>
          <StyledButton
            variant="outlined"
            endIcon={<AddIcon />}
            onClick={handleSubmit}
            disabled={!modificationContent.trim()}
          >
            Add
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}
