import { apiClient } from './apiClient'
import { IChat } from '../types/chat'

export const getChats = () => {
  return apiClient.get<{ message: string; data: IChat[] }>('/chats')
}
