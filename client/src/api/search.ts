import { IUser } from '../types/user'
import { apiClient } from './apiClient'

/**
 * @param uniqueName - uniqueName of User, GroupChat or Channel
 */
export const searchByUniqueName = async (uniqueName: string) => {
  return apiClient.get<{ code: string; data: IUser[] }>('/search/users', {
    params: { uniqueName }
  })
}
