import { apiClient } from './apiClient'

export const getSession = () => {
  return apiClient.get('/auth/session')
}

export const login = (phoneNumber: string, keepMeSignedIn: boolean) => {
  return apiClient.post('/auth/login', {
    phoneNumber,
    keepMeSignedIn
  })
}
