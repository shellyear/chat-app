import Logger from "../logger";
import redisClient from "./redisClient";
import { WebSocket } from "ws";

const DOMAIN = "wsConnectionService";

const addConnection = async (userId: string, ws: WebSocket) => {
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

const removeConnection = async (userId: string) => {
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

const getConnection = async (userId: string): Promise<WebSocket | null> => {
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

const wsConnectionService = {
  addConnection,
  removeConnection,
  getConnection,
};

export default wsConnectionService;
