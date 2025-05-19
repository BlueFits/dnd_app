import { Box, Paper, Typography } from '@mui/material'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

export interface MessageProps {
  content: string
  role?: 'user' | 'assistant'
  isStreaming?: boolean
}

export const Message = ({
  content,
  role = 'assistant',
  isStreaming = false
}: MessageProps): React.JSX.Element => {
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
          maxWidth: '100%',
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
                }
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
