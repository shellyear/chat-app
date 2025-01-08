import { IUser } from '../types/user'
import { apiClient } from './apiClient'

export const getSession = () => {
  return apiClient.get<{ user: IUser; sessionId?: string }>('/auth/session')
}

export const login = (email: string, keepMeSignedIn: boolean) => {
  return apiClient.post('/auth/login', {
    email,
    keepMeSignedIn
  })
}

export const verifyCode = (email: string, keepMeSignedIn: boolean, code: string) => {
  return apiClient.post<{ user: IUser; sessionId?: string }>('/auth/verify', {
    email,
    keepMeSignedIn,
    code
  })
}

export const logout = (isPersistent: boolean) => {
  if (isPersistent) {
    return apiClient.post('/auth/logout')
  }
  return sessionStorage.removeItem('sessionId')
}
