import { Request, Response } from "express";
import { IUser } from "../models/User";
import Logger from "../logger";
import UniqueName from "../models/UniqueName";
import { Types } from "mongoose";
import { IGroupChat } from "../models/GroupChat";
import { IChannel } from "../models/Channel";
import { PeerTypes } from "../types/peer";

const DOMAIN = "searchController";

type UniqueNameLookupDoc = {
  _id: Types.ObjectId;
  uniqueName: string;
  type: PeerTypes;
  referenceId: string;
  reference: IUser | IGroupChat | IChannel;
};

const searchUniqueNames = async (
  req: Request<{ query: string }>,
  res: Response
) => {
  const { uniqueName } = req.query;
  const { userId: currentUserId } = req.session;

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
        /* Lookup Contact data, to check if found user (by uniqueName) is in contacts of currentUser */
        {
          $lookup: {
            from: "contacts",
            let: { refId: "$referenceId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", currentUserId] }, // Contact.userId === currentUserId
                      { $eq: ["$contactId", "$$refId"] }, // Contact.contactId === UniqueName.referenceId
                    ],
                  },
                },
              },
            ],
            as: "contactData",
          },
        },
        {
          /* add Fields or modify existing ones */
          $addFields: {
            /* add reference field to output document */
            reference: {
              $cond: {
                if: { $eq: ["$type", "user"] },
                then: {
                  /* merge $userData and $contactData, prioritizing contact details for name and surname */
                  $mergeObjects: [
                    { $arrayElemAt: ["$userData", 0] },
                    {
                      name: {
                        $ifNull: [
                          { $arrayElemAt: ["$contactData.name", 0] },
                          { $arrayElemAt: ["$userData.0.name", 0] },
                        ],
                      },
                      surname: {
                        $ifNull: [
                          { $arrayElemAt: ["$contactData.surname", 0] },
                          { $arrayElemAt: ["$userData.0.surname", 0] },
                        ],
                      },
                    },
                  ],
                },
                else: {
                  $cond: {
                    if: { $eq: ["$type", "groupchat"] },
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
            contactData: 0,
            channelData: 0,
            "reference._id": 0,
            "reference.email": 0,
            "reference.uniqueName": 0,
            "reference.userId": 0,
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
