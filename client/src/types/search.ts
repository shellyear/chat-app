import { IChannel } from './channel'
import { IGroupChat } from './groupChat'
import { IUser } from './user'

export enum UniqueNameTypes {
  USER = 'user',
  GROUP_CHAT = 'group',
  CHANNEL = 'channel'
}

export type UniqueNameLookupDoc = {
  _id: string
  uniqueName: string
  type: UniqueNameTypes
  referenceId: string
  reference: IUser | IGroupChat | IChannel
}
