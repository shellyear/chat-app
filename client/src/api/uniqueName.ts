import { apiClient } from './apiClient'

export const checkUniqueNameAvailability = async (uniqueName: string) => {
  const response = await apiClient.get<{ code: 'UNIQUE_NAME_TAKEN' | 'UNIQUE_NAME_NOT_TAKEN' }>(
    `/uniqueNames/${uniqueName}`
  )

  return response.data
}

/*
 * get ChatInfo, GroupChatInfo, ChannelInfo by uniqueName
 */
export const getCommunityInfoByUniqueName = async (uniqueName: string) => {
  const response = await apiClient.get(`/uniqueNames/community/${uniqueName}`)

  return response.data
}
