export type IChat = {
  _id: string
  peer: {
    peerId: number
    displayName: string
    displayPicture: string
    uniqueName?: string
  }
  lastMessageId: { content: string; createdAt: Date }
}
