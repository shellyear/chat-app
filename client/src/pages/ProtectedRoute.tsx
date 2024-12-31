import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'

type ProtectedRouteProps = {
  children: React.JSX.Element
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  console.log({ user })
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
