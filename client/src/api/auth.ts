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

export const setupAccount = async ({
  email,
  name,
  surname,
  profilePicture,
  keepMeSignedIn
}: {
  email: string
  name: string
  surname?: string
  profilePicture?: File
  keepMeSignedIn: boolean
}) => {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('name', name)
  formData.append('keepMeSignedIn', keepMeSignedIn.toString())
  if (surname) formData.append('surname', surname)
  if (profilePicture) formData.append('profilePicture', profilePicture)

  const response = await apiClient.post<{
    code: 'SETUP_ACCOUNT_SUCCESS'
    user: IUser
    sessionId?: string
  }>('/auth/setup-account', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const verifyCode = async (email: string, verificationCode: string, keepMeSignedIn: boolean) => {
  const response = await apiClient.post<{
    user: IUser
    sessionId?: string
    code: 'SET_ACCOUNT_INFO' | 'VERIFICATION_SUCCESS'
  }>('/auth/verify', {
    email,
    keepMeSignedIn,
    code: verificationCode
  })
  return response.data
}

export const logout = (isPersistent: boolean) => {
  if (isPersistent) {
    return apiClient.post('/auth/logout')
  }
  return sessionStorage.removeItem('sessionId')
}
