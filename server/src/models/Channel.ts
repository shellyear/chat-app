import mongoose from "mongoose";

interface IChannel {
  channelId: number;
  name: string;
  uniqueName: string;
  description?: string;
  subscribers: number[];
}

const channelSchema = new mongoose.Schema({
  channelId: { type: Number, unique: true, required: true }, // format: -0123456789
  name: { type: String },
  uniqueName: { type: String, unique: true },
  description: { type: String },
  subscribers: [{ type: Number, ref: "User" }],
});

module.exports = mongoose.model<IChannel>("Channel", channelSchema);
