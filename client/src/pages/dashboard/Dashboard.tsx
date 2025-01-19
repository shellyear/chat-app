import { Outlet, useParams } from 'react-router-dom'

import Sidebar from './components/sidebar/Sidebar'
import useIsMobile from '../../hooks/useIsMobile'

function Dashboard() {
  const { username, chatId } = useParams<{ username?: string; chatId?: string }>()
  const { isMobile } = useIsMobile()

  const hideSidebar = isMobile && (username || chatId)

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <Outlet />
    </div>
  )
}

export default Dashboard
