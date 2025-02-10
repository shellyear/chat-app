import mongoose, { Schema } from "mongoose";

export interface IChat {
  participantsIds: number[];
  lastMessageId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema(
  {
    participantsIds: [
      {
        type: Number,
        ref: "User",
        required: true,
        validate: {
          validator: (v: number[]) => v.length === 2,
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
