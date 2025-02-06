import redisClient from "./redisClient";
import { IMessage } from "../models/Message";
import Logger from "../logger";
import { IMessageData } from "../types";
import { Types } from "mongoose";

const DOMAIN = "MessageQueueService";

const addUndeliveredMessage = async (userId: number, message: IMessage) => {
  try {
    const messageData = JSON.stringify({
      senderId: message.senderId,
      content: message.content,
      timestamp: message.createdAt,
      chatId: message.chatId,
    });

    await redisClient.lPush(`messages:${userId}`, messageData);
    Logger.info(`Undelivered message stored for user ${userId}`, DOMAIN);
  } catch (error) {
    Logger.error(
      `Error adding undelivered message for user ${userId}: ${error}`,
      DOMAIN
    );
    throw error;
  }
};

const getUndeliveredMessages = async (
  userId: number
): Promise<IMessageData[]> => {
  try {
    const undeliveredMessages = await redisClient.lRange(
      `messages:${userId}`,
      0,
      -1
    );

    return undeliveredMessages.map(
      (messageData) => JSON.parse(messageData) as IMessageData
    );
  } catch (error) {
    Logger.error(
      `Error fetching undelivered messages for user ${userId}: ${error}`,
      DOMAIN
    );
    return [];
  }
};

const clearUndeliveredMessages = async (userId: number) => {
  try {
    await redisClient.del(`messages:${userId}`);
    Logger.info(`Undelivered messages cleared for user ${userId}`, DOMAIN);
  } catch (error) {
    Logger.error(
      `Error clearing undelivered messages for user ${userId}: ${error}`,
      DOMAIN
    );
    throw error;
  }
};

const messageQueueService = {
  addUndeliveredMessage,
  getUndeliveredMessages,
  clearUndeliveredMessages,
};

export default messageQueueService;
