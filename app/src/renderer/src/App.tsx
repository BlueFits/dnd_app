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
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      maxWidth="lg"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid red'
      }}
    >
      <Box
        sx={{ flex: 1, overflow: 'auto', py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {messages
          .filter((message) => message.role !== 'system')
          .map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary'
                }}
              >
                <Typography>
                  <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                </Typography>
              </Paper>
            </Box>
          ))}
        {streamingContent && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Paper elevation={1} sx={{ maxWidth: '70%', p: 2 }}>
              <Typography>
                <Markdown remarkPlugins={[remarkGfm]}>{streamingContent}</Markdown>
                <Box component="span" sx={{ animation: 'pulse 1s infinite' }}>
                  ▋
                </Box>
              </Typography>
            </Paper>
          </Box>
        )}
        {status === 'loading' && !streamingContent && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Paper elevation={1} sx={{ p: 2 }}>
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
