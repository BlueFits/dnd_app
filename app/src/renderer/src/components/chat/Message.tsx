import { Box, Paper, styled } from '@mui/material'
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

const MessageContainer = styled(Box)<{ role: 'user' | 'assistant' }>(({ role }) => ({
  display: 'flex',
  justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  width: '100%'
}))

const MessagePaper = styled(Paper)<{ role: 'user' | 'assistant' }>(({ role, theme }) => ({
  maxWidth: role === 'user' ? '80%' : '100%',
  padding: theme.spacing(2),
  backgroundColor: role === 'user' ? 'rgb(48,48,48)' : 'transparent',
  color: theme.palette.primary.contrastText,
  borderRadius: '20px',
  lineHeight: 1.6,
  boxShadow: 'none',
  '& p': {
    marginBottom: '1em',
    '&:last-child': {
      marginBottom: 0
    }
  }
}))

const Cursor = styled(Box)({
  display: 'inline-block',
  animation: 'pulse 1s ease-in-out infinite',
  marginLeft: '2px'
})

const StyledHr = styled('hr')(({ theme }) => ({
  border: 'none',
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  width: '100%'
}))

const StyledBlockquote = styled('blockquote')(({ theme }) => ({
  borderLeft: '4px solid #424242',
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '0 4px 4px 0',
  '& p': {
    margin: 0
  }
}))

export const Message = memo(
  ({ content, role = 'assistant', isStreaming = false }: MessageProps): React.JSX.Element => {
    return (
      <MessageContainer role={role}>
        <MessagePaper role={role} elevation={0}>
          <Box sx={{ typography: 'body1' }}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={
                {
                  p: ({ children, node }) => {
                    const isLastParagraph = node?.position?.end.line === content.split('\n').length
                    return (
                      <Box sx={{ m: 0, mb: 2, '&:last-child': { mb: 0 } }}>
                        {children}
                        {isStreaming && isLastParagraph && <Cursor>▋</Cursor>}
                      </Box>
                    )
                  },
                  hr: () => <StyledHr />,
                  blockquote: ({ children }) => <StyledBlockquote>{children}</StyledBlockquote>
                } as Components
              }
            >
              {content}
            </Markdown>
          </Box>
        </MessagePaper>
      </MessageContainer>
    )
  }
)

Message.displayName = 'Message'
