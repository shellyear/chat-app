import mongoose, { Schema, Types } from "mongoose";

interface IChat {
  _id: Types.ObjectId;
  isGroupChat: boolean;
  participantsIds: Types.ObjectId[];
  groupName: string | null;
  groupImage: string | null;
  lastMessage: Types.ObjectId; // For fast retrieval of the latest message
  createdAt: Date;
}

const ChatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  participantsIds: [
    { type: Schema.Types.ObjectId, ref: "User", required: true },
  ],
  groupName: { type: String, default: null },
  groupImage: { type: String, default: null },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // For fast retrieval of the latest message
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>("Chat", ChatSchema);
