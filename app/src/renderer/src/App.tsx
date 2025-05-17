import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { increment, decrement } from './store/counterSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const dispatch = useAppDispatch()
  const [data, setData] = useState<unknown>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const jsonData = await window.api.readJsonFile('sessions/sessions-001.json')
        setData(jsonData)
      } catch (error) {
        console.error('Failed to load JSON:', error)
      }
    }

    loadData()
  }, [])

  const handleAddMessage = async (): Promise<void> => {
    if (!message.trim()) return

    try {
      const newMessage = {
        role: 'user',
        content: message
      }

      const updatedData = await window.api.appendToJsonFile('sessions/session-001.json', newMessage)
      setData(updatedData)
      setMessage('') // Clear the input after successful append
    } catch (error) {
      console.error('Failed to append message:', error)
    }
  }

  return (
    <>
      <div className="counter">
        <div>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}</div>
        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAddMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Message
          </button>
        </div>
        <h2 className="text-3xl font-bold underline text-red-500 text-[32px]">
          Counter: {useAppSelector((state) => state.counter.value)}
        </h2>
        <div className="counter-actions">
          <button onClick={() => dispatch(increment())}>Increment</button>
          <button onClick={() => dispatch(decrement())}>Decrement</button>
        </div>
      </div>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
