import Logger from "../logger";
import User, { IUser } from "../models/User";
import cloudinaryService from "./cloudinaryService";
import uniqueIdService from "./uniqueIdService";

const DOMAIN = "userService";

const createUser = async ({
  email,
  name,
  surname,
  profilePicture,
}: {
  email: string;
  name: string;
  surname?: string;
  profilePicture?: Express.Multer.File;
}) => {
  try {
    const userId = uniqueIdService.generateUserId() as string;
    const newUser = await User.create({
      userId,
      email,
      name,
      surname,
    });

    let imageUrl;
    if (profilePicture) {
      imageUrl = await cloudinaryService.uploadImageStream(
        "profile-pictures",
        userId,
        profilePicture
      );
      newUser.profilePicture = imageUrl;
    }

    await newUser.save();

    return newUser as IUser;
  } catch (error) {
    Logger.error(`Error while creating a user ${error}`, DOMAIN);
    throw error;
  }
};

const userService = {
  createUser,
};

export default userService;
