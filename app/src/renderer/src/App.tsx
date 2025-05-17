import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { sendMessage, loadMessages } from './store/chatSlice'

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
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((message) => message.role !== 'system')
          .map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white text-gray-800 rounded-lg p-3">
              {streamingContent}
              <span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
        {status === 'loading' && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg p-3">Thinking...</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
