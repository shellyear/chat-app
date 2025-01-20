import { Outlet, useParams } from 'react-router-dom'

import Sidebar from './components/sidebar/Sidebar'
import useIsMobile from '../../hooks/useIsMobile'

function Dashboard() {
  const { id } = useParams<{ id?: string }>()
  const { isMobile } = useIsMobile()

  const hideSidebar = isMobile && id

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <Outlet />
    </div>
  )
}

export default Dashboard
