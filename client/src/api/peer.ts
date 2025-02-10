import { PeerInfo } from '../types/peer'
import { apiClient } from './apiClient'

/**
 *  @param id - either uniqueName or userId, groupChatId, channelId
 *  get ChatInfo, GroupChatInfo, ChannelInfo by uniqueName
 */
export const getPeerById = async (id: string) => {
  const response = await apiClient.get<{ code: string; data: PeerInfo }>(`/peers/${id}`)

  return response.data
}
