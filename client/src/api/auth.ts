import { IUser } from '../types/user'
import { apiClient } from './apiClient'

export const getSession = () => {
  return apiClient.get('/auth/session')
}

export const login = (email: string, keepMeSignedIn: boolean) => {
  return apiClient.post('/auth/login', {
    email,
    keepMeSignedIn
  })
}

export const verifyCode = (email: string, keepMeSignedIn: boolean, code: string) => {
  return apiClient.post<{ user: IUser }>('/auth/verify', {
    email,
    keepMeSignedIn,
    code
  })
}
