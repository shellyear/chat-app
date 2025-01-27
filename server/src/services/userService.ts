import Logger from "../logger";
import User, { IUser } from "../models/User";
import uniqueIdService from "./uniqueIdService";

const DOMAIN = "userService";

const createUser = async (email: string) => {
  try {
    const userId = uniqueIdService.generateUserId() as string;
    const newUser = await User.create({ userId, email });

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
