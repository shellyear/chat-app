import mongoose, { Schema, Types } from "mongoose";

interface IChat {
  _id: Types.ObjectId;
  participantsIds: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema(
  {
    participantsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
          validator: (v: Types.ObjectId[]) => v.length === 2,
          message: "Chats must have exactly 2 participants",
        },
      },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
