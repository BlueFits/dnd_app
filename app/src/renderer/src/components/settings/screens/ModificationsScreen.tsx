import { useState } from 'react'
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { NavigationProps } from '../types'
import { StyledButton } from '../styles'
import { useSelector, useDispatch } from 'react-redux'
import { selectModifications, saveModificationsAsync, selectSessionId, updateModification } from '../../../store/modificationsSlice'
import { AppDispatch } from '../../../store/store'

export const ModificationsScreen = ({ onNavigate }: NavigationProps): React.JSX.Element => {
  const modifications = useSelector(selectModifications)
  const sessionId = useSelector(selectSessionId)
  const dispatch = useDispatch<AppDispatch>()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleRemove = async (index: number): Promise<void> => {
    if (sessionId) {
      const newModifications = modifications.filter((_, i) => i !== index)
      await dispatch(saveModificationsAsync({ sessionId, modifications: newModifications }))
    }
  }

  const handleEdit = (index: number): void => {
    setEditingIndex(index)
    setEditContent(modifications[index].content)
  }

  const handleSaveEdit = async (): Promise<void> => {
    if (editingIndex !== null && sessionId) {
      dispatch(updateModification({ index: editingIndex, content: editContent }))
      const updatedModifications = modifications.map((mod, i) =>
        i === editingIndex ? { ...mod, content: editContent } : mod
      )
      await dispatch(saveModificationsAsync({ sessionId, modifications: updatedModifications }))
      setEditingIndex(null)
    }
  }

  const handleCancelEdit = (): void => {
    setEditingIndex(null)
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
                <Box>
                  <IconButton edge="end" onClick={() => handleEdit(index)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={mod.content} secondary="System Modification" />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={editingIndex !== null}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
        keepMounted
      >
        <DialogTitle>Edit Modification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={8}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ minWidth: '600px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
