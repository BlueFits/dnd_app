import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'
import { loadPlayerData } from './store/playerSlice'
import { Box, IconButton, TextField, Paper, Fade, styled, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MessageList } from './components/chat/MessageList'

// Styled components
const VideoContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
  overflow: 'hidden'
})

const VideoElement = styled('video')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  minWidth: '100%',
  minHeight: '100%',
  width: 'auto',
  height: 'auto',
  transform: 'translate(-50%, -50%)',
  objectFit: 'cover',
  filter: 'brightness(0.7)'
})

const Overlay = styled(Box)(({ showVideo }: { showVideo: boolean }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: showVideo ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
  zIndex: -1,
  backdropFilter: showVideo ? 'blur(2px)' : 'none'
}))

const RootContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
})

const MessagesContainer = styled(Box)({
  flex: 1,
  overflow: 'auto',
  paddingTop: 16,
  paddingBottom: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  '&::-webkit-scrollbar': {
    width: '8px',
    transition: 'opacity 0.3s ease-in-out'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    transition: 'opacity 0.3s ease-in-out'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0, 0, 0, 0.3)'
  },
  '&:hover::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)'
  },
  '&::-webkit-scrollbar-thumb:vertical': {
    minHeight: '30px'
  },
  '&:not(:hover)::-webkit-scrollbar-thumb': {
    opacity: 0
  },
  '&:not(:hover)::-webkit-scrollbar': {
    opacity: 0
  }
})

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}))

const ScrollButton = styled(IconButton)({
  backgroundColor: '#4c5050',
  '&:hover': {
    backgroundColor: '#666'
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
})

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#4c5050',
  '&:hover': {
    backgroundColor: '#666'
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    '& .MuiSvgIcon-root': {
      color: '#666'
    }
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
}))

const InputContainer = styled(Box)({
  paddingLeft: 16,
  paddingRight: 16
})

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 16,
  marginTop: 'auto',
  marginBottom: 50,
  borderRadius: 25,
  background: 'transparent',
  border: `1px solid ${theme.palette.divider}`
})) as typeof Paper

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none'
    }
  }
})

const StreamPlaceholder = styled(Box)({
  height: '60vh',
  width: '100%'
})

const PlayerInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center'
}))

function App(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { messages, status, streamingContent } = useAppSelector((state) => state.chat)
  const player = useAppSelector((state) => state.player)
  const [inputMessage, setInputMessage] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showStreamPlaceholder, setShowStreamPlaceholder] = useState(false)
  const [showVideo] = useState(false)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLFormElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [buttonPosition, setButtonPosition] = useState(0)

  const scrollToBottom = useCallback((): void => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleScroll = useCallback((): void => {
    if (messagesContainerRef.current && lastMessageRef.current) {
      const containerRect = messagesContainerRef.current.getBoundingClientRect()
      const messageRect = lastMessageRef.current.getBoundingClientRect()
      const isAboveLastMessage = messageRect.bottom > containerRect.bottom
      setShowScrollButton(isAboveLastMessage)
    }
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
    return () => {}
  }, [handleScroll])

  useEffect(() => {
    const updateButtonPosition = (): void => {
      if (inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect()
        setButtonPosition(inputRect.top - 60)
      }
    }

    updateButtonPosition()
    window.addEventListener('resize', updateButtonPosition)
    return () => window.removeEventListener('resize', updateButtonPosition)
  }, [])

  useEffect(() => {
    dispatch(loadMessages())
    dispatch(loadPlayerData())
  }, [dispatch])

  useEffect(() => {
    if (status === 'loading') {
      setShowStreamPlaceholder(true)
      setTimeout(() => {
        scrollToBottom()
      }, 500)
    }
  }, [scrollToBottom, status])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      console.log('Video element found, attempting to play')
      video
        .play()
        .then(() => console.log('Video started playing'))
        .catch((error) => console.error('Error playing video:', error))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!inputMessage.trim() || status === 'loading') return

    try {
      await dispatch(sendMessage(inputMessage))
      setInputMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputMessage.trim() && status !== 'loading') {
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  const filteredMessages = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages]
  )

  return (
    <RootContainer>
      {showVideo && (
        <VideoContainer>
          <VideoElement
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => console.log('Video data loaded')}
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/videos/BigBuckBunny.mp4" type="video/mp4" />
          </VideoElement>
        </VideoContainer>
      )}
      <Overlay showVideo={showVideo} />
      <MessagesContainer ref={messagesContainerRef}>
        <ContentContainer>
          {player.name && (
            <PlayerInfo>
              <Typography variant="subtitle1">
                {player.name} (Level {player.level})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {player.traits.join(', ')}
              </Typography>
            </PlayerInfo>
          )}
          <MessageList
            messages={filteredMessages}
            streamingContent={streamingContent}
            status={status}
            lastMessageRef={lastMessageRef}
          />
          {showStreamPlaceholder && <StreamPlaceholder />}
        </ContentContainer>
      </MessagesContainer>

      <Fade in={showScrollButton}>
        <Box
          sx={{
            position: 'fixed',
            top: buttonPosition,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1
          }}
        >
          <ScrollButton onClick={scrollToBottom}>
            <KeyboardArrowDownIcon />
          </ScrollButton>
        </Box>
      </Fade>

      <InputContainer>
        <ContentContainer>
          <StyledPaper ref={inputRef} component="form" onSubmit={handleSubmit} elevation={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                fullWidth
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to do?"
                disabled={status === 'loading'}
                variant="outlined"
                size="small"
                multiline
                maxRows={4}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SendButton type="submit" disabled={status === 'loading' || !inputMessage.trim()}>
                  <SendIcon />
                </SendButton>
              </Box>
            </Box>
          </StyledPaper>
        </ContentContainer>
      </InputContainer>
    </RootContainer>
  )
}

export default App
