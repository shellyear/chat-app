import { Request, Response } from "express";
import Message from "../models/Message";
import Logger from "../logger";
import chatService from "../services/chatService";

const DOMAIN = "chatController";

const getChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    const chats = await chatService.getUserChats(userId);

    res.status(200).json({
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    Logger.error(`Error fetching chats: ${error}`, DOMAIN);
    res.status(500).json({
      message: "Failed to fetch chats",
      error,
    });
  }
};

/**
 * @id numeric chatId in format: 123456789
 */
const getChat = async (
  req: Request<{
    id: string;
  }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const chat = await chatService.getChatById(id);

    if (!chat) {
      res.status(404).json({
        code: "CHAT_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      code: "GET_CHAT_SUCCESS",
      data: chat,
    });
  } catch (error) {
    Logger.error(`Error while getting chat ${error}`, DOMAIN);
  }
};

const getMessages = async (
  req: Request<{
    chatId: number;
  }>,
  res: Response
) => {
  const { chatId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      code: "GET_CHAT_MESSAGES_SUCCESS",
      data: {
        messages,
        pagination: {
          currentPage: Number(page),
          pageSize: Number(limit),
          totalMessages: await Message.countDocuments({ chatId }),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const chatController = {
  getChats,
  getChat,
  getMessages,
};

export default chatController;
