import { redisClient } from "./redisClients";
import Logger from "../logger";
import { IMessageData } from "../types/message";
import { WebSocketOutgoingEvents } from "../types/ws";

const DOMAIN = "MessageQueueService";

const addUndeliveredMessage = async (
  userId: number,
  message: {
    event: WebSocketOutgoingEvents;
    senderId: number;
    peerId: number;
    content: string;
    createdAt: Date;
  }
) => {
  try {
    const messageData = JSON.stringify({
      event: message.event,
      senderId: message.senderId,
      peerId: message.peerId,
      content: message.content,
      createdAt: message.createdAt,
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

    return undeliveredMessages.map((messageData) => JSON.parse(messageData));
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
