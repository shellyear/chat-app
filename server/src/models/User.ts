import mongoose, { Schema, Document } from "mongoose";

type IImageUrl = string;

export interface IUser extends Document {
  _id: string;
  email: string;
  username?: string;
  profilePicture?: IImageUrl;
  photos?: IImageUrl[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true },
  profilePicture: { type: String },
  photos: [{ type: String }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
