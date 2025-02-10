export type IChat = {
  _id: string
  participantsIds: { _id: string; username: string; name: string; email: string }[]
  lastMessageId: { content: string; createdAt: Date }
}

export type IChatParticipantInfo = {
  userId: number
  name: string
  profilePicture?: string
  bio?: string
  uniqueName?: string
  email?: string
}
