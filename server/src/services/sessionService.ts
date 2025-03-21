import {
  DEFAULT_EXPIRATION,
  PERSISTENT_EXPIRATION,
} from "../constants/session";
import Logger from "../logger";
import { redisClient } from "./redisClients";
import { v4 as uuidv4 } from "uuid";
import { ISessionData } from "../types/session";

const DOMAIN = "sessionService";

const SESSION_PREFIX = "session:";

const createSession = async (data: ISessionData) => {
  try {
    const sessionID = uuidv4();
    const expirationTime = data.isPersistent
      ? PERSISTENT_EXPIRATION
      : DEFAULT_EXPIRATION;

    await redisClient.set(
      `${SESSION_PREFIX}${sessionID}`,
      JSON.stringify(data),
      {
        EX: expirationTime,
      }
    );

    return sessionID;
  } catch (error) {
    Logger.error(`Unable to create a session ${error}`, DOMAIN);
  }
};

const getSession = async (sessionId: string): Promise<ISessionData | null> => {
  try {
    const sessionData = await redisClient.get(`${SESSION_PREFIX}${sessionId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    Logger.error(`Unable to get session ${sessionId}, ${error}`, DOMAIN);
    return null;
  }
};

const updateSession = async (
  sessionId: number,
  newData: ISessionData,
  isPersistent: boolean = false
) => {
  try {
    const expirationTime = isPersistent
      ? PERSISTENT_EXPIRATION
      : DEFAULT_EXPIRATION;

    await redisClient.set(
      `${SESSION_PREFIX}${sessionId}`,
      JSON.stringify(newData),
      { EX: expirationTime } // Reset expiration on update
    );
  } catch (error) {
    Logger.error(`Unable to update session ${sessionId}`, DOMAIN);
  }
};

const refreshSession = async (
  sessionId: number,
  isPersistent: boolean = false
) => {
  const expirationTime = isPersistent
    ? PERSISTENT_EXPIRATION
    : DEFAULT_EXPIRATION;

  try {
    await redisClient.expire(`${SESSION_PREFIX}${sessionId}`, expirationTime);
  } catch (error) {
    Logger.error(`Unable to refresh session ${sessionId}`, DOMAIN);
  }
};

const deleteSession = async (sessionID: number) => {
  try {
    await redisClient.del(`${SESSION_PREFIX}${sessionID}`);
  } catch (error) {
    Logger.error(`Unable to delete session ${sessionID}, ${error}`, DOMAIN);
  }
};

const sessionService = {
  createSession,
  getSession,
  updateSession,
  refreshSession,
  deleteSession,
};

export default sessionService;
