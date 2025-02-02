import mongoose, { Schema, Document, Types } from "mongoose";

type IImageUrl = string;

export interface IUser extends Document {
  userId: string;
  email: string;
  uniqueName?: string;
  name?: string;
  surname?: string;
  bio?: string;
  profilePicture?: IImageUrl;
  // photos?: IImageUrl[];
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true }, // format: 0123456789  - 10 digits in string
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
