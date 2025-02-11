import Logger from "../logger";
import Chat from "../models/Chat";

const DOMAIN = "chatService";

const getChatById = async (chatId: string) => {
  try {
    const foundChat = await Chat.findOne({ chatId }).projection({ _id: 0 });

    return foundChat;
  } catch (error) {
    Logger.error(`Error while trying to find id ${error}`, DOMAIN);
    throw error;
  }
};

const getUserChats = async (userId: number) => {
  try {
    const chats = await Chat.aggregate([
      {
        $match: { participantsIds: { $in: [userId] } },
      },
      {
        $lookup: {
          from: "users",
          localField: "participantsIds",
          foreignField: "userId",
          as: "participants",
          pipeline: [
            {
              $project: {
                userId: 1,
                name: 1,
                profilePicture: 1,
                uniqueName: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessageId",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true, // Keep chats even if no messages exist
        },
      },
      {
        $lookup: {
          from: "contacts",
          let: {
            peerId: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$participantsIds",
                    as: "participant",
                    cond: { $ne: ["$$participant", userId] },
                  },
                },
                0,
              ],
            },
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$contactId", "$$peerId"] } } },
            { $project: { _id: 0, name: 1, surname: 1 } },
          ],
          as: "contactInfo",
        },
      },
      {
        $addFields: {
          recipient: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participants",
                  as: "participant",
                  cond: { $ne: ["$$participant.userId", userId] },
                },
              },
              0,
            ],
          },
          contactData: { $arrayElemAt: ["$contactInfo", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          peer: {
            peerId: "$recipient.userId",
            displayName: {
              $concat: [
                { $ifNull: ["$contactData.name", "$recipient.name"] },
                {
                  $cond: {
                    if: {
                      $ne: [
                        {
                          $ifNull: [
                            "$contactData.surname",
                            "$recipient.surname",
                          ],
                        },
                        null,
                      ],
                    },
                    then: {
                      $concat: [
                        " ",
                        {
                          $ifNull: [
                            "$contactData.surname",
                            "$recipient.surname",
                          ],
                        },
                      ],
                    },
                    else: "",
                  },
                },
              ],
            },
            displayPicture: "$recipient.profilePicture",
            uniqueName: "$recipient.uniqueName",
          },
          lastMessage: { content: 1, timestamp: 1 },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return chats;
  } catch (error) {
    Logger.error(`Error fetching user's chats: ${error}`, DOMAIN);
    throw error;
  }
};

const chatService = {
  getUserChats,
  getChatById,
};

export default chatService;
