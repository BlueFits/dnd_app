import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'
import {
  Box,
  Button,
  Container,
  TextField,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { Message } from './components/chat/Message'

function App(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { messages, status, streamingContent } = useAppSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    dispatch(loadMessages())
  }, [dispatch])

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
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages
          .filter((message) => message.role !== 'system')
          .map((message, index) => (
            <Message
              key={index}
              content={message.content}
              role={message.role === 'system' ? 'assistant' : message.role}
            />
          ))}
        {streamingContent && <Message content={streamingContent} isStreaming={true} />}
        {status === 'loading' && !streamingContent && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Paper elevation={0} sx={{ p: 2, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
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
