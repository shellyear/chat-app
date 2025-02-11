export const generateChatLink = (uniqueName: string, userId: number) => {
  if (uniqueName) {
    return `/@${uniqueName}` // for users and channels(in the future)
  }

  if (userId) {
    return `/${userId}`
  }
}
