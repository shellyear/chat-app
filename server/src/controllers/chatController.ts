import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import wsConnectionService from "../services/wsConnectionService";
import messageQueueService from "../services/messageQueueService";
import Logger from "../logger";
import chatService from "../services/chatService";
import { Types } from "mongoose";

const DOMAIN = "chatController";

const sendMessage = async (
  req: Request<
    { id: Types.ObjectId },
    {},
    {
      content: string;
    }
  >,
  res: Response
) => {
  const { id: recipientId } = req.params;
  const { content } = req.body;
  const { userId: senderId } = req.session;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participantsIds: [senderId, recipientId],
      });
    }

    const message = await Message.create({
      chatId: chat._id,
      senderId,
      content,
    });

    await message.save();

    chat.lastMessageId = message._id;
    await chat.save();

    const recipientWs = await wsConnectionService.getConnection(recipientId);

    if (recipientWs) {
      recipientWs.send(
        JSON.stringify({
          type: "NEW_MESSAGE",
          chatId: chat._id,
          message: {
            sender: senderId,
            content,
            timestamp: message.createdAt,
          },
        })
      );
    } else {
      await messageQueueService.addUndeliveredMessage(recipientId, message);
    }
    res.status(201).send();
  } catch (error) {
    Logger.error(`Error while sending a message ${error}`, DOMAIN);
  }
};

const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

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

const chatController = {
  sendMessage,
  getChats,
};

export default chatController;
