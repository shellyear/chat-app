export const generateChatLink = (username: string, userId: string) => {
  if (username) {
    return `/@${username}`
  }

  if (userId) {
    return `/${userId}`
  }
}

export const isUsername = (str: string) => {
  return str.startsWith('@')
}
