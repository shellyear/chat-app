import { redisPubSubClient } from "./redisClients";
import Logger from "../logger";
import { WebSocket } from "ws";

const DOMAIN = "pubsubService";

const subscribeToUserChannel = async (userId: number, ws: WebSocket) => {
  const channel = `user:${userId}`;

  await redisPubSubClient.subscribe(channel, (err, count) => {
    if (err) {
      Logger.error(`Error subscribing to channel ${channel}: ${err}`, DOMAIN);
    } else {
      Logger.info(`Subscribed to channel ${channel}; count:${count}`, DOMAIN);
    }
  });

  redisPubSubClient.on("message", (channel, message) => {
    if (channel === `user:${userId}`) {
      ws.send(message);
    }
  });
};

const publishToUserChannel = async (userId: number, message: string) => {
  const channel = `user:${userId}`;

  try {
    const result = await redisPubSubClient.publish(channel, message);
    Logger.info(
      `Message sent to user ${userId} on channel ${channel}. Subscribers: ${result}`,
      DOMAIN
    );
  } catch (err) {
    Logger.error(
      `Error publishing message to channel ${channel}: ${err}`,
      DOMAIN
    );
  }
};

export default {
  subscribeToUserChannel,
  publishToUserChannel,
};
