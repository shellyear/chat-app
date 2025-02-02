import { Request, Response } from "express";
import { IUser } from "../models/User";
import Logger from "../logger";
import UniqueName, { UniqueNameTypes } from "../models/UniqueName";
import { Types } from "mongoose";
import { IGroupChat } from "../models/GroupChat";
import { IChannel } from "../models/Channel";

const DOMAIN = "searchController";

type UniqueNameLookupDoc = {
  _id: Types.ObjectId;
  uniqueName: string;
  type: UniqueNameTypes;
  referenceId: string;
  reference: IUser | IGroupChat | IChannel;
};

const searchUniqueNames = async (req: Request<{ query: string }>, res: Response) => {
  const { uniqueName } = req.query;

  if (!uniqueName) {
    res.status(400).json({
      code: "MISSING_QUERY_PARAMETER",
    });
    return;
  }

  try {
    const uniqueNameDocsWithRefs: UniqueNameLookupDoc[] =
      await UniqueName.aggregate([
        {
          $match: {
            uniqueName: { $regex: uniqueName, $options: "i" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "referenceId",
            foreignField: "userId",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "groupchats",
            localField: "referenceId",
            foreignField: "groupChatId",
            as: "groupChatData",
          },
        },
        {
          $lookup: {
            from: "channels",
            localField: "referenceId",
            foreignField: "channelId",
            as: "channelData",
          },
        },
        {
          $addFields: {
            reference: {
              $cond: {
                if: { $eq: ["$type", "user"] },
                then: { $arrayElemAt: ["$userData", 0] },
                else: {
                  $cond: {
                    if: { $eq: ["$type", "group"] },
                    then: { $arrayElemAt: ["$groupChatData", 0] },
                    else: { $arrayElemAt: ["$channelData", 0] },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            userData: 0,
            groupChatData: 0,
            channelData: 0,
            "reference._id": 0,
            "reference.email": 0,
          },
        },
      ]);

    res.status(200).json({
      code: "FOUND_UNIQUE_NAMES",
      data: uniqueNameDocsWithRefs,
    });
  } catch (error) {
    Logger.error(`Error during search: ${error}`, DOMAIN);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchController = {
  searchUniqueNames,
};

export default searchController;
