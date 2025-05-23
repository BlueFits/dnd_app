import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { NavigationProps } from '../types'
import { StyledButton } from '../styles'
import { useSelector, useDispatch } from 'react-redux'
import { selectModifications, saveModificationsAsync, selectSessionId } from '../../../store/modificationsSlice'
import { AppDispatch } from '../../../store/store'

export const ModificationsScreen = ({ onNavigate }: NavigationProps): React.JSX.Element => {
  const modifications = useSelector(selectModifications)
  const sessionId = useSelector(selectSessionId)
  const dispatch = useDispatch<AppDispatch>()

  const handleRemove = async (index: number): Promise<void> => {
    if (sessionId) {
      const newModifications = modifications.filter((_, i) => i !== index)
      await dispatch(saveModificationsAsync({ sessionId, modifications: newModifications }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Modifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {modifications.length === 0
              ? 'No modifications installed'
              : `${modifications.length} modification(s) installed`}
          </Typography>
        </Box>
        <StyledButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onNavigate('add-modification')}
        >
          Add Modification
        </StyledButton>
      </Box>

      {modifications.length > 0 && (
        <List>
          {modifications.map((mod, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={mod.content} secondary="System Modification" />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
