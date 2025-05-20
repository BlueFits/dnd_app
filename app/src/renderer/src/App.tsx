import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'
import { Box, IconButton, Container, TextField, Paper } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { MessageList } from './components/chat/MessageList'

function App(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { messages, status, streamingContent } = useAppSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((): void => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    dispatch(loadMessages())
  }, [dispatch])

  // Scroll to bottom when messages change or streaming content updates
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

  const filteredMessages = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages]
  )

  return (
    <Container
      // disableGutters
      // maxWidth={false}
      maxWidth="lg"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <MessageList
          messages={filteredMessages}
          streamingContent={streamingContent}
          status={status}
        />
        <div ref={messagesEndRef} />
      </Box>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: 2,
          mt: 'auto',
          mb: '50px',
          borderRadius: '25px',
          background: 'transparent',
          border: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={status === 'loading'}
            variant="outlined"
            size="small"
            multiline
            maxRows={4}
            sx={{
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
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              type="submit"
              disabled={status === 'loading' || !inputMessage.trim()}
              sx={{
                backgroundColor: '#4c5050',
                '&:hover': {
                  backgroundColor: '#666'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'action.disabledBackground',
                  '& .MuiSvgIcon-root': {
                    color: '#666'
                  }
                },
                '& .MuiSvgIcon-root': {
                  color: 'white'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default App
