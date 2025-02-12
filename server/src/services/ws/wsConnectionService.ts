import Config from "../../config";
import Logger from "../../logger";
import messageQueueService from "../messageQueueService";
import { redisClient } from "../redisClients";
import { WebSocket } from "ws";

const DOMAIN = "wsConnectionService";

const connections: Map<number, WebSocket> = new Map();

const addConnection = async (userId: number, ws: WebSocket) => {
  try {
    connections.set(userId, ws);
    await redisClient.hSet("userConnections", userId, Config.MACHINE_ID);
    Logger.info(`Connection for user ${userId} was added`, DOMAIN);
  } catch (error) {
    Logger.error(`Error while adding ws connection: ${error}`, DOMAIN);
  }
};

const removeConnection = async (userId: number) => {
  try {
    connections.delete(userId);
    await redisClient.hDel("userConnections", userId.toString());
    Logger.info(`Connection for user ${userId} was removed`, DOMAIN);
  } catch (error) {
    Logger.error(`Error while removing ws connection: ${error}`, DOMAIN);
  }
};

const getConnection = (userId: number): WebSocket | undefined => {
  return connections.get(userId);
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
