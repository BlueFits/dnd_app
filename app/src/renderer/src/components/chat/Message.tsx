import { Box, Paper, Typography } from '@mui/material'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Components } from 'react-markdown'
import { memo } from 'react'

export interface MessageProps {
  content: string
  role?: 'user' | 'assistant'
  isStreaming?: boolean
}

export const Message = memo(
  ({ content, role = 'assistant', isStreaming = false }: MessageProps): React.JSX.Element => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
          width: '100%'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: role === 'user' ? '80%' : '100%',
            p: 2,
            bgcolor: role === 'user' ? 'rgb(48,48,48)' : 'transparent',
            color: 'primary.contrastText',
            borderRadius: '20px',
            lineHeight: 1.6,
            boxShadow: 'none',
            '& p': {
              marginBottom: '1em',
              '&:last-child': {
                marginBottom: 0
              }
            }
          }}
        >
          <Typography component="div" variant="body1">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={
                {
                  p: ({ children, node }) => {
                    // Only add cursor to the last paragraph of streaming content
                    const isLastParagraph = node?.position?.end.line === content.split('\n').length
                    return (
                      <p>
                        {children}
                        {isStreaming && isLastParagraph && (
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              animation: 'pulse 1s ease-in-out infinite',
                              marginLeft: '2px'
                            }}
                          >
                            ▋
                          </Box>
                        )}
                      </p>
                    )
                  },
                  hr: () => (
                    <Box
                      component="hr"
                      sx={{
                        border: 'none',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        my: 3,
                        width: '100%'
                      }}
                    />
                  ),
                  blockquote: ({ children }) => (
                    <Box
                      component="blockquote"
                      sx={{
                        borderLeft: '4px solid',
                        borderColor: '#424242',
                        pl: 2,
                        py: 1,
                        my: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '0 4px 4px 0',
                        '& p': {
                          margin: 0
                        }
                      }}
                    >
                      {children}
                    </Box>
                  )
                } as Components
              }
            >
              {content}
            </Markdown>
          </Typography>
        </Paper>
      </Box>
    )
  }
)

Message.displayName = 'Message'
