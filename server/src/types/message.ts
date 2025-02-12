import { Types } from "mongoose";

export interface IMessage {
  chatId: Types.ObjectId;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IMessageData = {
  senderId: string;
  content: string;
  message: string;
  timestamp: number;
  chatId: string;
};
