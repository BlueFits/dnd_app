import { Button, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const MenuButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  width: '100%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(2)
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  border: `1px solid ${theme.palette.divider}`,
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: `1px solid ${theme.palette.divider}`
  }
}))

export const ContentContainer = styled(Box)({
  width: '100%',
  minHeight: '300px',
  position: 'relative'
})
