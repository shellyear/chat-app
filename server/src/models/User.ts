import mongoose, { Schema, Document } from "mongoose";

type IImageUrl = string;

export interface IUser extends Document {
  _id: string;
  email: string;
  username?: string;
  name?: string;
  surname?: string;
  profilePicture?: IImageUrl;
  photos?: IImageUrl[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: false },
  name: { type: String },
  surname: { type: String },
  profilePicture: { type: String },
  photos: [{ type: String }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
