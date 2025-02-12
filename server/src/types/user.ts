export interface IUser {
  userId: number;
  email: string;
  uniqueName?: string;
  name?: string;
  surname?: string;
  bio?: string;
  profilePicture?: string; // url
  // photos?: IImageUrl[];
  createdAt: Date;
  updatedAt: Date;
}
