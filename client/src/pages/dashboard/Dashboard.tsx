import { useState } from 'react'

import ChatArea from './components/chatarea/ChatArea'
import Sidebar from './components/sidebar/Sidebar'

function Dashboard() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const openChat = (chatId: string) => {
    setActiveChatId(chatId)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar openChat={openChat} />
      <ChatArea />
    </div>
  )
}

export default Dashboard
