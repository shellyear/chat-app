import mongoose, { Schema, Types } from "mongoose";

export interface IChat {
  _id: number;
  participantsIds: number[];
  lastMessageId: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    participantsIds: [
      {
        type: Number,
        ref: "User",
        required: true,
        validate: {
          validator: (v: Types.ObjectId[]) => v.length === 2,
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
