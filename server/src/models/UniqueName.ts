import mongoose from "mongoose";

export enum UniqueNameTypes {
  USER = "user",
  GROUP_CHAT = "group",
  CHANNEL = "channel",
}

export type IUniqueNameSchema = {
  uniqueName: string;
  type: string;
  referenceId: string;
};

const uniqueNameSchema = new mongoose.Schema({
  uniqueName: {
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 4,
    maxlength: 34,
  },
  type: { type: String, enum: ["user", "group", "channel"], required: true },
  referenceId: { type: String, required: true },
});

const UniqueName = mongoose.model<IUniqueNameSchema>(
  "UniqueName",
  uniqueNameSchema
);

export default UniqueName;
