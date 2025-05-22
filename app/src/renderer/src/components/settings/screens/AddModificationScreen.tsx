import { Box, Typography, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { StyledButton } from '../styles'

export const AddModificationScreen = (): React.JSX.Element => {
  const [modificationUrl, setModificationUrl] = useState('')

  const handleSubmit = (): void => {
    // TODO: Handle modification URL submission
    console.log('Submitting modification URL:', modificationUrl)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
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
          marginTop: 2,
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          placeholder="Enter modification URL or identifier"
          value={modificationUrl}
          onChange={(e) => setModificationUrl(e.target.value)}
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
          <StyledButton variant="outlined" endIcon={<AddIcon />} onClick={handleSubmit}>
            Add
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}
