import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
