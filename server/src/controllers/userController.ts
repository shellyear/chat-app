import { Request, Response } from "express";
import User from "../models/User";
import Logger from "../logger";
import UniqueName, { UniqueNameTypes } from "../models/UniqueName";
import cloudinaryService from "../services/cloudinaryService";

const DOMAIN = "userController";

const findUser = async (
  req: Request<{
    id: string;
  }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ userId: id });

    if (!user) {
      res.status(404).json({
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      code: "GET_USER_SUCCESS",
      data: user,
    });
  } catch (error) {
    Logger.error(`Error while fetching user ${error}`, DOMAIN);
    res.status(500).json({ code: "GET_USER_ERRO", error });
  }
};

/**
  Set uniqueName for the current user
*/
const setProfileInfo = async (
  req: Request<
    {},
    {},
    {
      name?: string;
      surname?: string;
      bio?: string;
      uniqueName?: string;
    }
  >,
  res: Response
) => {
  try {
    const { userId } = req.session;
    const { uniqueName, name, surname, bio } = req.body;
    const profilePicture: Express.Multer.File | undefined = req.file;

    if (uniqueName) {
      const existingUniqueName = await UniqueName.exists({ uniqueName });
      if (existingUniqueName) {
        res.status(400).json({ code: "UNIQUE_NAME_TAKEN" });
        return;
      }

      const userUniqueNameDoc = await UniqueName.findOne({
        referenceId: userId,
      });

      if (userUniqueNameDoc) {
        userUniqueNameDoc.uniqueName = uniqueName;
        await userUniqueNameDoc.save();
      } else {
        const newUniqueNameDoc = new UniqueName({
          uniqueName,
          type: UniqueNameTypes.USER,
          referenceId: userId,
        });
        await newUniqueNameDoc.save();
      }
    }

    let imageUrl;
    if (profilePicture) {
      imageUrl = await cloudinaryService.uploadImageStream(
        "profile-pictures",
        userId,
        profilePicture
      );
    }

    const updateData: Record<string, string | undefined> = {};
    if (uniqueName) updateData.uniqueName = uniqueName;
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (bio) updateData.bio = bio;
    if (imageUrl) updateData.profilePicture = imageUrl;

    const updatedUser = await User.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: updateData,
      },
      { new: true, projection: { _id: 0 } }
    );

    if (!updatedUser) {
      res.status(404).json({ code: "USER_NOT_FOUND" });
      return;
    }

    res.status(200).json({ code: "PROFILE_UPDATE_SUCCESS", data: updatedUser });
  } catch (error) {
    Logger.error(`Error while setting profile info ${error}`, DOMAIN);
  }
};

const userController = {
  findUser,
  setProfileInfo,
};

export default userController;
