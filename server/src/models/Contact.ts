import mongoose from "mongoose";
import { IContact } from "../types/contact";

const ContactSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, index: true },
    contactId: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    surname: { type: String },
  },
  { timestamps: true }
);

/* Each user (userId) can only have one contact (email) in the contact list - compound index */
ContactSchema.index({ userId: 1, email: 1 }, { unique: true });

export default mongoose.model<IContact>("Contact", ContactSchema);
