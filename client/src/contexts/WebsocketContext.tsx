/* eslint-disable no-console */
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

import Config from '../config'
import { PeerTypes } from '../types/peer'
import { IncomingWebSocketMessage, WebSocketIncomingEvents, WebSocketOutgoingEvents } from '../types/ws'
import { useMessages } from './MessagesContext'

const eventMapping = {
  user: WebSocketOutgoingEvents.SEND_PRIVATE_MESSAGE,
  group: WebSocketOutgoingEvents.SEND_GROUP_MESSAGE,
  channel: WebSocketOutgoingEvents.SEND_GROUP_MESSAGE,
  secret_chat: WebSocketOutgoingEvents.SEND_SECRET_MESSAGE
}

interface IWebsocketContext {
  sendMessage: (content: string, peerId: number, peerType: PeerTypes) => void
}

interface IWebsocketProvider {
  children: ReactNode
}

const notificationSound = new Audio('/telegram_notification.mp3')

export const WebsocketContext = createContext<IWebsocketContext | undefined>(undefined)

function WebsocketProvider({ children }: IWebsocketProvider) {
  const [isReady, setIsReady] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const { addMessage } = useMessages()

  const createWebSocket = () => {
    const ws = new WebSocket(Config.WEBSOCKET_BASE_URL)

    ws.onopen = () => {
      console.log('WebSocket connection with the server has been established')
      ws.send('WebSocket connection with the server has been established')
      setIsReady(true)
    }

    ws.onmessage = (e: MessageEvent) => {
      try {
        const parsedData: IncomingWebSocketMessage = JSON.parse(e.data)
        notificationSound.play()
        if (parsedData.event === WebSocketIncomingEvents.NEW_PRIVATE_MESSAGE) {
          addMessage(parsedData.peerId, parsedData)
          console.log('onmessage', parsedData)
        }
      } catch (error) {
        console.log('Error while getting a message', new Date())
      }
    }

    ws.onclose = (e: CloseEvent) => {
      console.log('WebSocket closed', e)
      setIsReady(false)
      setTimeout(() => {
        console.log('Attempting to reconnect...')
        createWebSocket()
      }, 3000) // Try to reconnect to wss after 3 sec
    }

    wsRef.current = ws
  }

  useEffect(() => {
    createWebSocket()
    return () => {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useMemo(() => {
    return (content: string | ArrayBufferLike | Blob | ArrayBufferView, peerId: number, peerType: PeerTypes) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const event = eventMapping[peerType]
        const messageData = {
          event,
          content,
          peerId
        }
        wsRef.current.send(JSON.stringify(messageData))
      } else {
        console.error('WebSocket is not ready to send messages')
      }
    }
  }, [])

  const contextValue = useMemo(() => ({ isReady, sendMessage }), [isReady, sendMessage])

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
