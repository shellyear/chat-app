import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { IncomingWebSocketMessage } from '../types/ws'

interface IMessagesContext {
  addMessage: (peerId: number, message: IncomingWebSocketMessage) => void
  messages: { [x: number]: IncomingWebSocketMessage[] }
}

const MessagesContext = createContext<IMessagesContext | undefined>(undefined)

interface IMessagesProvider {
  children: React.ReactNode
}

function MessagesProvider({ children }: IMessagesProvider) {
  const [messages, setMessages] = useState<{ [x: number]: IncomingWebSocketMessage[] }>({})

  const addMessage = (peerId: number, message: IncomingWebSocketMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [peerId]: [...(prevMessages[peerId] || []), message]
    }))
  }

  const contextValue = useMemo(() => ({ messages, addMessage }), [messages])

  return <MessagesContext.Provider value={contextValue}>{children}</MessagesContext.Provider>
}

export const useMessages = () => {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}

export default MessagesProvider
