import { apiClient } from './apiClient'
import { IChat } from '../types/chat'
import { IUser } from '../types/user'

export const getChats = () => {
  return apiClient.get<{ message: string; data: IChat[] }>('/chats')
}

type Username = string
type UserId = string
type ChatId = Username | UserId

export const getChat = async (id: ChatId) => {
  const response = await apiClient.get<{ code: string; data: { chat: IChat; user: IUser } }>(`/chats/${id}`)

  return response.data
}

export const getChatMessages = async (chatId: string, page: number) => {
  const response = await apiClient.get(`/chats/${chatId}/messages`, {
    params: {
      page
    }
  })
  return response.data
}
