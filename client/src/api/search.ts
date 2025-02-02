import { UniqueNameLookupDoc } from '../types/search'
import { apiClient } from './apiClient'

/**
 * @param uniqueName - uniqueName of User, GroupChat or Channel
 */
export const searchByUniqueName = async (uniqueName: string) => {
  return apiClient.get<{ code: string; data: UniqueNameLookupDoc[] }>('/search/uniqueNames', {
    params: { uniqueName }
  })
}
