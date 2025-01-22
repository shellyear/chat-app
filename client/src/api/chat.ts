import { apiClient } from './apiClient'
import { IChat } from '../types/chat'
import { IMessage } from '../types/message'
import { IUser } from '../types/user'

export const getChats = () => {
  return apiClient.get<{ message: string; data: IChat[] }>('/chats')
}

/**
 * @param chatId - "@username", "@channel", "userId", "chatId"
 */
export const getChat = async (chatId: string) => {
  const response = await apiClient.get<{ code: string; data: { chat: IChat; participant: IUser } }>(`/chats/${chatId}`)

  return response.data
}

export const getChatMessages = async (chatId: string, page: number, limit?: number) => {
  const response = await apiClient.get<{
    code: string
    data: {
      messages: IMessage[]
      pagination: {
        currentPage: number
        pageSize: number
        totalMessages: number
      }
    }
  }>(`/chats/${chatId}/messages`, {
    params: {
      page,
      limit
    }
  })
  return response.data
}
