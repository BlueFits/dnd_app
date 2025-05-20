import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'
import { Box, IconButton, TextField, Paper, Fade, styled } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MessageList } from './components/chat/MessageList'

// Styled components
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
  gap: 16
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

function App(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { messages, status, streamingContent } = useAppSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLFormElement>(null)
  const [buttonPosition, setButtonPosition] = useState(0)

  const scrollToBottom = useCallback((): void => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  const handleScroll = useCallback((): void => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isScrolledUp)
    }
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
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
  }, [dispatch])

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, streamingContent, scrollToBottom])

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
      <MessagesContainer ref={messagesContainerRef}>
        <ContentContainer>
          <MessageList
            messages={filteredMessages}
            streamingContent={streamingContent}
            status={status}
          />
          <div ref={messagesEndRef} />
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
