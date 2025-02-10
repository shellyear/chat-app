export enum PeerTypes {
  USER = 'user',
  GROUP_CHAT = 'group',
  CHANNEL = 'channel',
  SECRET_CHAT = 'secret_chat'
}

export type PeerInfo = {
  type: PeerTypes
  peerId: number
  name: string
  profilePicture?: string
  bio?: string
  uniqueName?: string
  email?: string
}
