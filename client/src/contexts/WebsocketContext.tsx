import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

import Config from '../config'

interface IWebsocketContext {
  sendMessage: Function
}

interface IWebsocketProvider {
  children: ReactNode
}

export const WebsocketContext = createContext<IWebsocketContext | undefined>(undefined)

function WebsocketProvider({ children }: IWebsocketProvider) {
  const [isReady, setIsReady] = useState(false)
  const [value, setValue] = useState(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(Config.WEBSOCKET_BASE_URL)

    ws.onopen = () => {
      console.log('WebSocket connection with the server has been established')
      ws.send('WebSocket connection with the server has been established')
      setIsReady(true)
    }

    ws.onmessage = (e: MessageEvent) => {
      setValue(e.data)
      console.log('Message from server', e.data)
    }

    wsRef.current = ws

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useMemo(() => {
    return (message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(message)
      } else {
        console.error('WebSocket is not ready to send messages')
      }
    }
  }, [])

  const contextValue = useMemo(() => ({ value, isReady, sendMessage }), [isReady, sendMessage, value])

  return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
}

export const useWebsocket = (): IWebsocketContext => {
  const context = useContext(WebsocketContext)

  if (!context) {
    throw new Error('useWebsocket must be used within an WebsocketProvider')
  }

  return context
}

export default WebsocketProvider
