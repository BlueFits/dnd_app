import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'
import {
  Box,
  Button,
  Container,
  TextField,
  Paper
} from '@mui/material'
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
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 2, mt: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={status === 'loading'}
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={status === 'loading' || !inputMessage.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default App
