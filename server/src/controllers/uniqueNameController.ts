import { Request, Response } from "express";
import UniqueName, { IUniqueName, UniqueNameTypes } from "../models/UniqueName";
import userService from "../services/userService";

const checkUniqueNameAvailability = async (
  req: Request<{
    uniqueName: string;
  }>,
  res: Response
) => {
  const { uniqueName } = req.params;

  const uniqueNameTaken = await UniqueName.exists({ uniqueName });

  if (uniqueNameTaken) {
    res.status(409).json({
      code: "UNIQUE_NAME_TAKEN",
    });
    return;
  }

  res.status(200).json({
    code: "UNIQUE_NAME_NOT_TAKEN",
  });
};

/**
 * Get ChatInfo, GroupChatInfo, ChannelInfo using uniqueName
 */
const getCommunityInfoByUniqueName = async (
  req: Request<{
    uniqueName: string;
  }>,
  res: Response
) => {
  const { uniqueName } = req.params;
  const { userId } = req.session;

  const uniqueNameDoc: IUniqueName | null = await UniqueName.findOne({
    uniqueName,
  });

  if (!uniqueNameDoc) {
    res.status(404).json({
      code: "COMMUNITY_NOT_FOUND",
    });
    return;
  }

  let communityInfo = null;

  if (uniqueNameDoc.type === UniqueNameTypes.USER) {
    const lookupUserId = uniqueNameDoc.referenceId;

    const foundUser = await userService.getUserWithContactOverride(
      userId,
      lookupUserId
    );

    if (foundUser) {
      communityInfo = {
        profilePicture: foundUser.profilePicture,
        uniqueName: foundUser.uniqueName,
        name: foundUser.surname
          ? `${foundUser.name} ${foundUser.surname}`
          : foundUser.name,
        description: foundUser.bio,
        email: foundUser.email ? foundUser.email : undefined,
      };
    }
  }

  if (uniqueNameDoc.type === UniqueNameTypes.GROUP_CHAT) {
    // TODO: return communityInfo
  }

  if (uniqueNameDoc.type === UniqueNameTypes.CHANNEL) {
    // TODO: return communityInfo
  }

  if (!communityInfo) {
    res.status(404).json({
      code: "COMMUNITY_NOT_FOUND",
    });
    return;
  }

  res.status(200).json({
    code: "GET_COMMUNITY_INFO_SUCCESS",
    data: communityInfo,
  });
};

const uniqueNameController = {
  checkUniqueNameAvailability,
  getCommunityInfoByUniqueName,
};

export default uniqueNameController;
