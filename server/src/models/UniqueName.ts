import mongoose from "mongoose";
import { PeerTypes } from "../types/peer";

export type IUniqueName = {
  uniqueName: string;
  type: string;
  referenceId: number;
};

const uniqueNameSchema = new mongoose.Schema({
  uniqueName: {
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 5,
    maxlength: 34,
  },
  type: {
    type: String,
    enum: [
      PeerTypes.USER,
      PeerTypes.GROUP_CHAT,
      PeerTypes.CHANNEL,
      PeerTypes.SECRET_CHAT,
    ],
    required: true,
  },
  referenceId: { type: Number, required: true },
});

const UniqueName = mongoose.model<IUniqueName>("UniqueName", uniqueNameSchema);

export default UniqueName;
