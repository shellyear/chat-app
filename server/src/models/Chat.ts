import mongoose, { Schema, Types } from "mongoose";

export interface IChat {
  chatId: string;
  participantsIds: number[];
  lastMessageId: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema(
  {
    chatId: { type: String, unique: true, required: true }, // format: 0123456789 - 10 characters
    participantsIds: [
      {
        type: String,
        ref: "User",
        required: true,
        validate: {
          validator: (v: string[]) => v.length === 2,
          message: "Chats must have exactly 2 participants",
        },
      },
    ],
    lastMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

ChatSchema.index({ participantsIds: 1 });

export default mongoose.model<IChat>("Chat", ChatSchema);
