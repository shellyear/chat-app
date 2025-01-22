import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import wsConnectionService from "../services/wsConnectionService";
import messageQueueService from "../services/messageQueueService";
import Logger from "../logger";
import chatService from "../services/chatService";
import { Types } from "mongoose";
import User from "../models/User";
import Contact from "../models/Contact";

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

/**
 * @id "@username" or "userId" or "chatId"
 */
const getChat = async (
  req: Request<{
    id: string | Types.ObjectId;
  }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    let foundUserByUsername;
    let foundUserById;
    let foundChatById;
    let foundChatByParticipants;

    if (id.toString().startsWith("@")) {
      foundUserByUsername = await User.findOne({
        username: id,
      });

      if (!foundUserByUsername) {
        /* find a channel here */
      }
    }

    if (!foundUserByUsername) {
      foundUserById = await User.findById(id);

      if (!foundUserById) {
        foundChatById = await Chat.findById(id);
      }
    }

    if (!foundUserById && !foundUserByUsername) {
      res.status(404).json({ code: "USER_NOT_FOUND" });
      return;
    }

    if (!foundChatById) {
      const participantId = foundUserById?._id || foundUserByUsername?._id;
      foundChatByParticipants = await Chat.findOne({
        participantsIds: { $all: [userId, participantId] },
      }).populate("lastMessageId");
    }

    const participant = foundUserById || foundUserByUsername;
    const participantContact = await Contact.findOne({
      userId,
      contactId: participant?._id,
    });

    res.status(200).json({
      code: "GET_CHAT_DATA_SUCCESS",
      data: {
        chat:
          foundChatById?.populate("lastMessageId") ||
          foundChatByParticipants?.populate("lastMessageId"),
        participant: {
          ...participant,
          ...(participantContact && {
            name: participantContact.name,
            surname: participantContact.surname,
          }),
        },
      },
    });
  } catch (error) {}
};

const getMessages = async (
  req: Request<{
    chatId: Types.ObjectId;
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
  sendMessage,
  getChats,
  getChat,
  getMessages,
};

export default chatController;
