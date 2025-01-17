import { Route, Routes } from 'react-router-dom'

import ChatArea from './components/chatarea/ChatArea'
import Sidebar from './components/sidebar/Sidebar'

function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Routes>
        <Route path="/@:username" element={<ChatArea />} />
        <Route path="/:chatId" element={<ChatArea />} />
        <Route path="*" element={<ChatArea />} />
      </Routes>
    </div>
  )
}

export default Dashboard
