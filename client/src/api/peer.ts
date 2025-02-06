import { apiClient } from './apiClient'
import { IChatParticipantInfo } from '../types/chat'

/**
 *  @param id - either uniqueName or userId, groupChatId, channelId
 *  get ChatInfo, GroupChatInfo, ChannelInfo by uniqueName
 */
export const getPeerById = async (id: string) => {
  const response = await apiClient.get<{ code: string; data: IChatParticipantInfo }>(`/peers/${id}`)

  return response.data
}
