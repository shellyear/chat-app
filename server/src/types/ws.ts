export enum WebSocketEvents {
  SEND_PRIVATE_MESSAGE = "send_private_message",
  SEND_GROUP_MESSAGE = "send_group_message",
  SEND_CHANNEL_MESSAGE = "send_channel_message",
  SEND_SECRET_MESSAGE = "send_secret_message",
}

interface BaseMessage {
  event: WebSocketEvents;
  content: string;
}

export interface PrivateMessage extends BaseMessage {
  event: WebSocketEvents.SEND_PRIVATE_MESSAGE;
  recipientId: number;
}

export interface GroupMessage extends BaseMessage {
  event: WebSocketEvents.SEND_GROUP_MESSAGE;
  groupChatId: string;
}

export interface ChannelMessage extends BaseMessage {
  event: WebSocketEvents.SEND_CHANNEL_MESSAGE;
  channelId: string;
}

export type WebSocketMessage = PrivateMessage | GroupMessage | ChannelMessage;
