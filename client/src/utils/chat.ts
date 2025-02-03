export const generateChatLink = (username: string, userId: string) => {
  if (username) {
    return `/@${username}` // for users and channels(in the future)
  }

  if (userId) {
    return `/${userId}`
  }
}

enum IdTypeEnum {
  UNIQUE_NAME = 'UNIQUE_NAME',
  USER = 'USER',
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
  GROUP_CHAT = 'GROUP_CHAT'
}

export const getIdType = (id: string): IdTypeEnum | null => {
  if (id.startsWith('@')) {
    return IdTypeEnum.UNIQUE_NAME
  }

  if (id.startsWith('-')) {
    // groupChat or ChannelId
    const slicedId = id.slice(1)

    if (slicedId.length === 10) {
      return IdTypeEnum.CHANNEL
    }

    if (slicedId.length === 9) {
      return IdTypeEnum.GROUP_CHAT
    }
  }

  if (id.length === 9) {
    return IdTypeEnum.USER
  }

  if (id.length === 10) {
    return IdTypeEnum.CHAT
  }

  return null
}
