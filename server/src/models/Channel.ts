import mongoose from "mongoose";
import { IChannel } from "../types/channel";

const channelSchema = new mongoose.Schema({
  channelId: { type: Number, unique: true, required: true }, // format: -0123456789
  name: { type: String },
  uniqueName: { type: String, unique: true },
  description: { type: String },
  subscribers: [{ type: Number, ref: "User" }],
});

module.exports = mongoose.model<IChannel>("Channel", channelSchema);
