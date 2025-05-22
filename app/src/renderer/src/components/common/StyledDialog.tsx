import { Dialog, styled } from '@mui/material'

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(8px)',
    borderRadius: '20px'
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)'
  }
}))
