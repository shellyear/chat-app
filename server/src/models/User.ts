import mongoose, { Schema, Document, Types } from "mongoose";

type IImageUrl = string;

export interface IUser extends Document {
  _id: number;
  email: string;
  username?: string;
  name?: string;
  surname?: string;
  bio?: string;
  profilePicture?: IImageUrl;
  photos?: IImageUrl[];
}

const UserSchema = new Schema<IUser>({
  _id: { type: Number },
  email: { type: String, unique: true, required: true, index: true },
  username: { type: String, unique: true, required: false, index: true },
  name: { type: String },
  surname: { type: String },
  bio: { type: String },
  profilePicture: { type: String },
  photos: [{ type: String }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
