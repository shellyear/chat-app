import Logger from "../logger";
import Chat from "../models/Chat";
import { Types } from "mongoose";

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
  getChatById,
};

export default chatService;
