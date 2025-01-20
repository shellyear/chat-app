import { IUser } from '../types/user'
import { apiClient } from './apiClient'

export const getUser = async (userId: string) => {
  const response = await apiClient.get<{ code: string; data: IUser }>(`/users/${userId}`)

  return response.data
}
