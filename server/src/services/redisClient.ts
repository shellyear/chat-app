import redis from "redis";
import Logger from "../logger";

const DOMAIN = "redisClient";

const redisClient = redis.createClient();

(async () => {
  try {
    await redisClient.connect();
    Logger.info("Connected to Redis in redisClient");
  } catch (err) {
    Logger.error(`Redis connection error: ${err}`, DOMAIN);
  }
})();

export default redisClient;
