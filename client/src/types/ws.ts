export enum WebSocketOutgoingEvents {
  SEND_PRIVATE_MESSAGE = 'send_private_message',
  SEND_GROUP_MESSAGE = 'send_group_message',
  SEND_CHANNEL_MESSAGE = 'send_channel_message',
  SEND_SECRET_MESSAGE = 'send_secret_message'
}

export enum WebSocketIncomingEvents {
  NEW_PRIVATE_MESSAGE = 'new_private_message',
  NEW_GROUP_MESSAGE = 'new_group_message',
  NEW_CHANNEL_MESSAGE = 'new_channel_message',
  NEW_SECRET_MESSAGE = 'new_secret_message'
}

interface IncomingBaseMessage {
  event: WebSocketIncomingEvents
  content: string
  peerId: number
}

export interface IncomingPrivateMessage extends IncomingBaseMessage {
  event: WebSocketIncomingEvents.NEW_PRIVATE_MESSAGE
}

export type IncomingWebSocketMessage = IncomingPrivateMessage
