export const generateChatLink = (username: string, userId: string) => {
  if (username) {
    return `/@${username}` // for users and channels(in the future)
  }

  if (userId) {
    return `/${userId}`
  }
}

export enum IdTypeEnum {
  UNIQUE_NAME = 'UNIQUE_NAME',
  USER = 'USER',
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
  GROUP_CHAT = 'GROUP_CHAT'
}

export const getIdMetadata = (
  id: string
): {
  type: IdTypeEnum
  id: string
} | null => {
  if (id.startsWith('@')) {
    return {
      type: IdTypeEnum.UNIQUE_NAME,
      id: id.slice(1)
    }
  }

  if (id.startsWith('-')) {
    // groupChat or ChannelId
    const slicedId = id.slice(1)

    if (slicedId.length === 10) {
      return {
        type: IdTypeEnum.CHANNEL,
        id: slicedId
      }
    }

    if (slicedId.length === 9) {
      return {
        type: IdTypeEnum.GROUP_CHAT,
        id: slicedId
      }
    }
  }

  if (id.length === 9) {
    return {
      type: IdTypeEnum.USER,
      id
    }
  }

  if (id.length === 10) {
    return {
      type: IdTypeEnum.CHAT,
      id
    }
  }

  return null
}
