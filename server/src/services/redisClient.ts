import * as redis from "redis";
import Logger from "../logger";
import Config from "../config";

const DOMAIN = "redisClient";

const redisClient = redis.createClient({
  url: `redis://${Config.REDIS_PUBLIC_ENDPOINT}`,
  password: Config.REDIS_USER_PASSWORD,
});

(async () => {
  try {
    await redisClient.connect();
    Logger.info("Connected to Redis in redisClient");
  } catch (err) {
    Logger.error(`Redis connection error: ${err}`, DOMAIN);
  }
})();

export default redisClient;
