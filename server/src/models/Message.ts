import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  _id: string;
  from: string; // User's phone number or username
  to: string; // Recipient's phone number or username
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
