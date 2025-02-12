import Logger from "../logger";
import messageQueueService from "./messageQueueService";
import { redisClient } from "./redisClients";
import { WebSocket } from "ws";

const DOMAIN = "wsConnectionService";

const addConnection = async (userId: number, ws: WebSocket) => {
  try {
    await redisClient.set(`ws:${userId}`, JSON.stringify(ws), {
      EX: 3600, // 1h in s
    });
    Logger.info(`WebSocket connection stored for user ${userId}`, DOMAIN);
  } catch (error) {
    Logger.error(
      `Error storing WebSocket connection for user ${userId}: ${error}`,
      DOMAIN
    );
    throw error;
  }
};

const removeConnection = async (userId: number) => {
  try {
    await redisClient.del(`ws:${userId}`);
    Logger.info(`WebSocket connection removed for user ${userId}`, DOMAIN);
  } catch (error) {
    Logger.error(
      `Error removing WebSocket connection for user ${userId}: ${error}`,
      DOMAIN
    );
    throw error;
  }
};

const getConnection = async (userId: number): Promise<WebSocket | null> => {
  try {
    const wsData = await redisClient.get(`ws:${userId}`);

    if (!wsData) {
      Logger.debug(`No WebSocket connection found for user ${userId}`, DOMAIN);
      return null;
    }

    return JSON.parse(wsData) as WebSocket;
  } catch (error) {
    Logger.error(
      `Error retrieving WebSocket connection for user ${userId}: ${error}`,
      DOMAIN
    );
    return null;
  }
};

const handleUserReconnect = async (userId: number, ws: WebSocket) => {
  try {
    const undeliveredMessages =
      await messageQueueService.getUndeliveredMessages(userId);

    if (undeliveredMessages.length > 0) {
      for (const message of undeliveredMessages) {
        ws.send(
          JSON.stringify({
            type: "NEW_MESSAGE",
            chatId: message.chatId,
            message: {
              sender: message.senderId,
              content: message.content,
              timestamp: message.timestamp,
            },
          })
        );
      }

      await messageQueueService.clearUndeliveredMessages(userId);
    }

    Logger.info(`User has recieved undelivered messages.`);
  } catch (error) {
    Logger.error(`Error handling user reconnect: ${error}`, DOMAIN);
  }
};

const wsConnectionService = {
  addConnection,
  removeConnection,
  getConnection,
  handleUserReconnect,
};

export default wsConnectionService;
