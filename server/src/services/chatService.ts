import Logger from "../logger";
import Chat from "../models/Chat";
import { Types } from "mongoose";

const DOMAIN = "chatService";

const getUserChats = async (userId: string) => {
  try {
    const chats = await Chat.find({
      participantsIds: { $in: [userId] },
    })
      .populate("participantsIds", ["email", "name", "profilePicture"])
      .populate("lastMessageId", ["content", "createdAt"])
      .sort({ updatedAt: -1 });

    return chats;
  } catch (error) {
    Logger.error(`Error fetching user's chats: ${error}`, DOMAIN);
    throw error;
  }
};

const chatService = {
  getUserChats,
};

export default chatService;
