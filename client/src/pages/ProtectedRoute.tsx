import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'

import { auth } from '../firebase'

export function ProtectedRoute() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])

  if (loading) {
    return (
      <div className="loading-component">
        <p>Loading...</p>
      </div>
    )
  }

  return <Outlet context={{ user }} />
}
