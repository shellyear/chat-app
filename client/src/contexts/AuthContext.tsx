import React, { createContext, useState, useEffect, useMemo } from 'react'
import axios from 'axios'

import { IUser } from '../types/user'
import API from '../api'

interface IAuthContext {
  user: IUser | null
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined)

interface IAuthProvider {
  children: React.ReactNode
}

function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.auth.getSession()
        setUser(response.data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const contextValue = useMemo(() => ({ user, loading, setUser }), [user, loading])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
