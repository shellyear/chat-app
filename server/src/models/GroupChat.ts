import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGroupChat extends Document {
  groupChatId: string;
  name: string;
  uniqueName?: string;
  description: string;
  members: number[];
}

const GroupChatSchema = new Schema<IGroupChat>(
  {
    groupChatId: { type: String, unique: true, required: true }, // format: -123456789
    uniqueName: { type: String, unique: true },
    name: { type: String },
    description: { type: String },
    members: [{ type: Number, ref: "User" }],
  },
  { timestamps: true }
);

const GroupChat = mongoose.model<IGroupChat>("GroupChat", GroupChatSchema);
export default GroupChat;
