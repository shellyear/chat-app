export enum WebSocketIncomingEvents {
  SEND_PRIVATE_MESSAGE = "send_private_message",
  SEND_GROUP_MESSAGE = "send_group_message",
  SEND_CHANNEL_MESSAGE = "send_channel_message",
  SEND_SECRET_MESSAGE = "send_secret_message",
}

export enum WebSocketOutgoingEvents {
  NEW_PRIVATE_MESSAGE = "new_private_message",
  NEW_GROUP_MESSAGE = "new_group_message",
  NEW_CHANNEL_MESSAGE = "new_channel_message",
  NEW_SECRET_MESSAGE = "new_secret_message",
}

interface BaseMessage {
  event: WebSocketIncomingEvents;
  content: string;
  peerId: number;
}

export interface PrivateMessage extends BaseMessage {
  event: WebSocketIncomingEvents.SEND_PRIVATE_MESSAGE;
}

export interface GroupMessage extends BaseMessage {
  event: WebSocketIncomingEvents.SEND_GROUP_MESSAGE;
}

export interface ChannelMessage extends BaseMessage {
  event: WebSocketIncomingEvents.SEND_CHANNEL_MESSAGE;
}

export type WebSocketMessage = PrivateMessage | GroupMessage | ChannelMessage;
