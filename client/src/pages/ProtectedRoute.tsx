import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../firebase'

export function ProtectedRoute() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="loading-component">
        <p>Loading...</p>
      </div>
    )
  }

  return <Outlet context={{ user }} />
}
