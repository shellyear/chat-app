import { HydratedDocument } from "mongoose";
import Logger from "../logger";
import User from "../models/User";
import { IUser } from "../types/user";

import cloudinaryService from "./cloudinaryService";
import peerService from "./peerService";

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
    const userId = peerService.uniqueIdGenerator.generateUserId();
    const newUser: HydratedDocument<IUser> = await User.create({
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

    return newUser;
  } catch (error) {
    Logger.error(`Error while creating a user ${error}`, DOMAIN);
    throw error;
  }
};

const getUserWithContactOverride = async (
  currentUserId: number,
  lookupUserId: number
) => {
  const result: {
    userId: number;
    name: string;
    surname?: string;
    uniqueName?: string;
    profilePicture?: string;
    bio?: string;
    email: string | null; // sent if lookupUserId is in currentUserId contact list
  }[] = await User.aggregate([
    { $match: { userId: lookupUserId } },
    {
      $lookup: {
        from: "contacts",
        let: { userId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$contactId", "$$userId"] },
                  { $eq: ["$userId", currentUserId] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "contactData",
      },
    },
    {
      $addFields: {
        displayName: {
          $cond: {
            if: { $gt: [{ $size: "$contactData" }, 0] },
            then: { $arrayElemAt: ["$contactData.name", 0] },
            else: "$name",
          },
        },
        displaySurname: {
          $cond: {
            if: { $gt: [{ $size: "$contactData" }, 0] },
            then: { $arrayElemAt: ["$contactData.surname", 0] },
            else: "$surname",
          },
        },
        displayEmail: {
          $cond: {
            if: { $gt: [{ $size: "$contactData" }, 0] },
            then: { $arrayElemAt: ["$contactData.email", 0] },
            else: null,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        profilePicture: 1,
        uniqueName: 1,
        bio: 1,
        email: "$displayEmail",
        name: "$displayName",
        surname: "$displaySurname",
      },
    },
  ]);

  return result.length ? result[0] : null;
};

const userService = {
  createUser,
  getUserWithContactOverride,
};

export default userService;
