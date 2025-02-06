import mongoose, { Types } from "mongoose";

interface IContact {
  userId: number;
  contactId: number;
  name: string;
  email: string;
  surname?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
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
