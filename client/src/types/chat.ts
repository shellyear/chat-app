export type IChat = {
  _id: string
  participantsIds: { _id: string; username: string; name: string; email: string }[]
  lastMessageId: { content: string; createdAt: Date }
}
