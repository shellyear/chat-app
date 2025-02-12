import { NextFunction, Request, Response } from "express";
import sessionService from "../services/sessionService";
import Logger from "../logger";
import { SESSION_COOKIE } from "../constants/session";

const DOMAIN = "sessionMiddleware";

const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies[SESSION_COOKIE];

  if (!sessionId) {
    res.clearCookie(SESSION_COOKIE);
    res.status(401).json({ message: "User unauthorized" });
    return;
  }

  try {
    const sessionData = await sessionService.getSession(sessionId);

    if (!sessionData) {
      res.clearCookie(SESSION_COOKIE);
      Logger.debug(
        "Session expired or invalid, user redirected to login page on FE.",
        DOMAIN
      );
      res.status(401).json({ message: "User unauthorized" });
      return;
    }

    req.session = sessionData;

    await sessionService.refreshSession(sessionId, sessionData.isPersistent);

    next();
  } catch (error) {
    Logger.error(`Error retrieving session: ${error}`, "Session Middleware");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default sessionMiddleware;
