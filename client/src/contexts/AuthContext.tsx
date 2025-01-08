import React, { createContext, useState, useEffect, useMemo, useContext } from 'react'

import { IUser } from '../types/user'
import API from '../api'

interface IAuthContext {
  user: IUser | null
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
  isPersistent: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

interface IAuthProvider {
  children: React.ReactNode
}

function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isPersistent, setIsPersistent] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const response = await API.auth.getSession()
        setUser(response.data.user)
        setIsPersistent(!response.data.sessionId)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const contextValue = useMemo(() => ({ user, loading, setUser, isPersistent }), [user, loading, isPersistent])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
