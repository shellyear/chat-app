import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  _id: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  senderId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: Number, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
