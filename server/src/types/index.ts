export type IUser = {
  id: string;
  email: string;
  name: string;
};

export type IMessageData = {
  senderId: string;
  content: string;
  message: string;
  timestamp: number;
  chatId: string;
};

export enum SocketEvents {
  PRIVATE_MESSAGE = "private_message",
  SET_USER = "set_user",
  DISCONNECT = "disconnect",
}
