export interface Message extends Record<string, unknown> {
  role: 'user' | 'assistant' | 'system'
  content: string
}
