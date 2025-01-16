import { IUser } from '../types/user'
import { apiClient } from './apiClient'

export const searchUsers = async (query: string) => {
  return apiClient.get<{ code: string; data: IUser[] }>('/search/users', {
    params: { query }
  })
}
