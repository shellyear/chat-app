import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  _id: string;
  name: string;
  members: string[]; // array of usernames or phone numbers
  messages: string[]; // message IDs
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const Group = mongoose.model<IGroup>("Group", GroupSchema);
export default Group;
