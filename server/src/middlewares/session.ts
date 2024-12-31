import { NextFunction, Request, Response } from "express";
import sessionService from "../services/sessionService";
import Logger from "../logger";
import { SESSION_COOKIE } from "../constants/session";

const sessionMiddleware = async (
  req: Request<
    {},
    {},
    {
      keepMeSignedIn: boolean;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies[SESSION_COOKIE];

  if (!sessionId) {
    req.session = undefined;
    res.clearCookie(SESSION_COOKIE);
    res.redirect("/login");
    return;
  }

  try {
    const sessionData = await sessionService.getSession(sessionId);

    if (!sessionData) {
      req.session = undefined;
      res.clearCookie(SESSION_COOKIE);
      Logger.info("Session expired or invalid, user redirected to login page.");
      res.redirect("/login");
      return;
    }

    req.session = sessionData;

    const expirationTime = sessionData.isPersistent
      ? 30 * 24 * 60 * 60
      : undefined; // 30 days in seconds, or undefined
    await sessionService.refreshSession(sessionId, expirationTime);

    next();
  } catch (error) {
    Logger.error(`Error retrieving session: ${error}`, "Session Middleware");
    req.session = undefined;
    res.status(500).json({ message: "Internal Server Error" });
    return next();
  }
};

export default sessionMiddleware;
