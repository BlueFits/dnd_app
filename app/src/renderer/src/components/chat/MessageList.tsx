import { Box, Paper, Typography, CircularProgress } from '@mui/material'
import { memo, RefObject } from 'react'
import { Message } from './Message'

interface MessageListProps {
  messages: Array<{
    content: string
    role: 'user' | 'assistant' | 'system'
  }>
  streamingContent?: string
  status: string
  lastMessageRef?: RefObject<HTMLDivElement | null>
}

export const MessageList = memo(
  ({ messages, streamingContent, status, lastMessageRef }: MessageListProps) => {
    // Find the last user message index
    const lastUserMessageIndex = [...messages].reverse().findIndex((msg) => msg.role === 'user')
    const lastUserMessageIndexFromStart =
      lastUserMessageIndex === -1 ? -1 : messages.length - 1 - lastUserMessageIndex

    return (
      <>
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            role={message.role === 'system' ? 'assistant' : message.role}
            ref={index === lastUserMessageIndexFromStart ? lastMessageRef : undefined}
          />
        ))}
        {streamingContent && (
          <Message content={streamingContent} isStreaming={true} role="assistant" />
        )}
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
  }
)

MessageList.displayName = 'MessageList'
