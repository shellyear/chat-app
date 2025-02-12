import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>({
  userId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  uniqueName: { type: String, unique: true, minlength: 5, maxlength: 34 },
  surname: { type: String },
  bio: { type: String },
  profilePicture: { type: String },
  // photos: [{ type: String }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
