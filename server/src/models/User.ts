import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  phoneNumber: string;
  username?: string;
}

const UserSchema = new Schema<IUser>({
  phoneNumber: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
