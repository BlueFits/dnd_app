import React from 'react'
import { Box, IconButton, styled } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const StyledToolbar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  background: `linear-gradient(to bottom, ${theme.palette.background.default} 0%, transparent 100%)`,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '48px',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '30px 16px',
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.up('lg')]: {
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    borderBottom: 'none',
    background: 'transparent'
  }
}))

const Toolbar: React.FC = () => {
  return (
    <StyledToolbar>
      <IconButton
        color="inherit"
        aria-label="settings"
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <SettingsIcon />
      </IconButton>
    </StyledToolbar>
  )
}

export default Toolbar
