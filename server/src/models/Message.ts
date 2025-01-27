import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    _id: { type: Number },
    chatId: { type: Number, ref: "Chat", required: true },
    senderId: { type: Number, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
