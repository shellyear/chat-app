export const generateChatLink = (username: string, userId: string) => {
  if (username) {
    return `/@${username}`
  }

  if (userId) {
    return `/${userId}`
  }
}
