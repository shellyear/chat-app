export enum WebSocketEvents {
  SEND_PRIVATE_MESSAGE = "send_private_message",
  SEND_GROUP_MESSAGE = "send_group_message",
  SEND_CHANNEL_MESSAGE = "send_channel_message",
  SEND_SECRET_MESSAGE = "send_secret_message",
}

interface BaseMessage {
  event: WebSocketEvents;
  content: string;
  peerId: number;
}

export interface PrivateMessage extends BaseMessage {
  event: WebSocketEvents.SEND_PRIVATE_MESSAGE;
}

export interface GroupMessage extends BaseMessage {
  event: WebSocketEvents.SEND_GROUP_MESSAGE;
}

export interface ChannelMessage extends BaseMessage {
  event: WebSocketEvents.SEND_CHANNEL_MESSAGE;
}

export type WebSocketMessage = PrivateMessage | GroupMessage | ChannelMessage;
