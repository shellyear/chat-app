export const generateChatLink = (username: string, userId: string) => {
  if (username) {
    return `/@${username}` // for users and channels(in the future)
  }

  if (userId) {
    return `/${userId}`
  }
}
