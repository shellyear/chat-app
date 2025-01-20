/* eslint-disable no-unused-vars */
export enum SocketEvents {
  PRIVATE_MESSAGE = 'private_message',
  SET_USER = 'set_user'
}

export type IMessage = {
  _id: string
  chatId: string
  senderId: string
  content: string
  createdAt: Date
  updatedAt: Date
  isRead: boolean
}
