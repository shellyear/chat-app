import Logger from "../logger";
import User from "../models/User";
import { IUser } from "../types";
import uniqueIdService from "./uniqueIdService";

const DOMAIN = "userService";

const createUser = async (email: string) => {
  const userId = uniqueIdService.generateUserId();

  try {
    const newUser = await User.create({ userId, email });

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
