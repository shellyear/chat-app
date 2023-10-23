import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { User } from 'firebase/auth'
import { Socket } from 'socket.io-client'

import { auth } from '../firebase'
import { socket } from '../socket'

export type OutletContext = {
  user: User
  socket: Socket
}

export function ProtectedRoute() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  if (loading) {
    return (
      <div className="loading-component">
        <p>Loading...</p>
      </div>
    )
  }

  return <Outlet context={{ user, socket }} />
}
