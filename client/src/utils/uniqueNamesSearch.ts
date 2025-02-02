import { UniqueNameTypes, UniqueNameLookupDoc } from '../types/search'
import { IUser } from '../types/user'
import { IChannel } from '../types/channel'
import { IGroupChat } from '../types/groupChat'

export const getLookupDocId = (lookupDoc: UniqueNameLookupDoc) => {
  if (lookupDoc.type === UniqueNameTypes.USER) {
    return (lookupDoc.reference as IUser).userId
  }
  if (lookupDoc.type === UniqueNameTypes.CHANNEL) {
    return (lookupDoc.reference as IChannel).channelId
  }
  if (lookupDoc.type === UniqueNameTypes.GROUP_CHAT) {
    return (lookupDoc.reference as IGroupChat).groupChatId
  }
}

export const getLookupDocNaming = (lookupDoc: UniqueNameLookupDoc) => {
  if (lookupDoc.type === UniqueNameTypes.USER) {
    if ((lookupDoc.reference as IUser).name && !(lookupDoc.reference as IUser).surname) {
      return (lookupDoc.reference as IUser).name
    }
    return `${(lookupDoc.reference as IUser).name} ${(lookupDoc.reference as IUser)?.surname}`
  }
  if (lookupDoc.type === UniqueNameTypes.CHANNEL) {
    return (lookupDoc.reference as IChannel).name
  }
  if (lookupDoc.type === UniqueNameTypes.GROUP_CHAT) {
    return (lookupDoc.reference as IGroupChat).name
  }
}

export const getLookupDocProfilePicture = (lookupDoc: UniqueNameLookupDoc) => {
  if (lookupDoc.type === UniqueNameTypes.USER) {
    return (lookupDoc.reference as IUser).profilePicture
  }
  if (lookupDoc.type === UniqueNameTypes.CHANNEL) {
    return (lookupDoc.reference as IChannel).profilePicture
  }
  if (lookupDoc.type === UniqueNameTypes.GROUP_CHAT) {
    return (lookupDoc.reference as IGroupChat).profilePicture
  }
}
