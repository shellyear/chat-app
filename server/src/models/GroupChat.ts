import mongoose, { Schema } from "mongoose";
import { IGroupChat } from "../types/groupChat";

const GroupChatSchema = new Schema<IGroupChat>(
  {
    groupChatId: { type: Number, unique: true, required: true, index: true }, // format: -123456789
    uniqueName: { type: String, unique: true },
    name: { type: String },
    description: { type: String },
    members: [{ type: Number, ref: "User" }],
  },
  { timestamps: true }
);

const GroupChat = mongoose.model<IGroupChat>("GroupChat", GroupChatSchema);
export default GroupChat;
