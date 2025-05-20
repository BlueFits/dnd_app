import { Box, Paper, Typography, CircularProgress } from '@mui/material'
import { memo } from 'react'
import { Message } from './Message'

interface MessageListProps {
  messages: Array<{
    content: string
    role: 'user' | 'assistant' | 'system'
  }>
  streamingContent?: string
  status: string
}

export const MessageList = memo(({ messages, streamingContent, status }: MessageListProps) => {
  return (
    <>
      {messages.map((message, index) => (
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
    </>
  )
})

MessageList.displayName = 'MessageList'
