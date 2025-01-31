import { IUser } from '../types/user'
import { apiClient } from './apiClient'

export const getUser = async (userId: string) => {
  const response = await apiClient.get<{ code: string; data: IUser }>(`/users/${userId}`)

  return response.data
}

export const setProfileInfo = async (
  userId: string,
  data: {
    name?: string
    surname?: string
    bio?: string
    uniqueName?: string
    profilePicture?: File | null
  }
) => {
  const formData = new FormData()

  if (data.name) formData.append('name', data.name)
  if (data.surname) formData.append('surname', data.surname)
  if (data.bio) formData.append('bio', data.bio)
  if (data.uniqueName) formData.append('uniqueName', data.uniqueName)

  if (data.profilePicture) {
    formData.append('profilePicture', data.profilePicture)
  }

  const response = await apiClient.post<{ code: string; data: IUser }>(`/users/${userId}/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}
