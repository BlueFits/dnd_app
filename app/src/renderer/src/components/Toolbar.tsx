import React, { useState } from 'react'
import { Box, IconButton, styled } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { SettingsModal } from './settings/SettingsModal'

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSettingsOpen = (): void => setIsSettingsOpen(true)
  const handleSettingsClose = (): void => setIsSettingsOpen(false)

  return (
    <StyledToolbar role="toolbar">
      <IconButton
        color="inherit"
        aria-label="settings"
        tabIndex={0}
        onClick={handleSettingsOpen}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <SettingsIcon />
      </IconButton>
      <SettingsModal open={isSettingsOpen} onClose={handleSettingsClose} />
      {/* <SettingsModal open={true} onClose={handleSettingsClose} /> */}
    </StyledToolbar>
  )
}

export default Toolbar
