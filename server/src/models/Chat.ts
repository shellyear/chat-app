import mongoose, { Schema } from "mongoose";
import { IChat } from "../types/chat";

const ChatSchema = new mongoose.Schema(
  {
    participantsIds: {
      type: [Number, Number],
      validate: {
        validator: (v: number[]) => v.length === 2,
        message: "Chats must have exactly 2 participants",
      },
      required: true,
    },
    lastMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

ChatSchema.index({ participantsIds: 1 });

export default mongoose.model<IChat>("Chat", ChatSchema);
