import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  messageType: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  messageType: { type: String, default: "text" },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
