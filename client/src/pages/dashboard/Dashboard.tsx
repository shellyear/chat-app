import ChatArea from './components/chatarea/ChatArea'
import Sidebar from './components/sidebar/Sidebar'

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatArea />
    </div>
  )
}

export default Dashboard
