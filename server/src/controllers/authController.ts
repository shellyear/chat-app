import { Request, Response } from "express";
import User from "../models/User";
import { generateCode } from "../utils/generateCode";
import {
  DEFAULT_EXPIRATION,
  PERSISTENT_EXPIRATION,
  SESSION_COOKIE,
} from "../constants/session";
import redisClient from "../services/redisClient";
import emailService from "../services/emailService";
import sessionService from "../services/sessionService";
import Config from "../config";
import Logger from "../logger";

const DOMAIN = "authController";

const login = async (
  req: Request<
    {},
    {},
    {
      email: string;
      keepMeSignedIn: boolean;
    }
  >,
  res: Response
) => {
  const { email, keepMeSignedIn } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const verificationCode = generateCode();
    const expirationTime = keepMeSignedIn
      ? PERSISTENT_EXPIRATION
      : DEFAULT_EXPIRATION;

    if (existingUser) {
      await redisClient.set(email, verificationCode, {
        EX: expirationTime,
      });

      await emailService.sendVerificationEmail(email, verificationCode);

      res.status(200).json({
        message: "Verification code sent to your email",
        code: "VERIFICATION_CODE_SENT",
      });

      return;
    }

    await redisClient.set(email, verificationCode, {
      EX: expirationTime,
    });

    const newUser = new User({ email });
    await newUser.save();

    await emailService.sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      message: "Verification code sent to your email",
      code: "VERIFICATION_CODE_SENT",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send verification code",
      code: "VERIFICATION_CODE_SEND_FAIL",
    });
  }
};

const verify = async (
  req: Request<
    {},
    {},
    {
      email: string;
      code: string;
      keepMeSignedIn: boolean;
    }
  >,
  res: Response
) => {
  const { email, code, keepMeSignedIn } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      /* This should not happen if the user always registers via the /login route first. */
      res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
      return;
    }

    const storedVerificationCode = await redisClient.get(email);

    if (!storedVerificationCode) {
      res.status(400).json({
        message: "Verification code has expired",
        code: "CODE_EXPIRED",
      });
      return;
    }

    if (storedVerificationCode === code) {
      const newSessionId = await sessionService.createSession({
        userId: user._id,
        isPersistent: keepMeSignedIn,
      });

      if (keepMeSignedIn) {
        res.cookie(SESSION_COOKIE, newSessionId, {
          httpOnly: true,
          secure: Config.NODE_ENV === "production",
          sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
          maxAge: PERSISTENT_EXPIRATION * 1000,
          domain:
            Config.NODE_ENV === "production" ? Config.COOKIE_DOMAIN : undefined,
        });
      }

      res.status(200).json({
        message: "Verification successful",
        user: {
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
          name: user.name,
          surname: user.surname,
        },
        ...(!keepMeSignedIn && { sessionId: newSessionId }),
      });
    } else {
      res.status(400).json({
        message: "Invalid verification code",
        code: "INVALID_VERIFICATION_CODE",
      });
    }
  } catch (error) {
    Logger.error(`Error while verifying code: ${error}`, DOMAIN);
    res.status(500).json({
      message: "Failed to verify code",
      code: "INVALID_VERIFICATION_CODE",
    });
  }
};

const session = async (req: Request, res: Response) => {
  try {
    const sessionID =
      req.cookies[SESSION_COOKIE] || req.headers.authorization?.split(" ")[1];

    if (!sessionID) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const sessionData = await sessionService.getSession(sessionID);

    if (!sessionData) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await User.findById(sessionData.userId);

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await sessionService.refreshSession(sessionID, sessionData.isPersistent);

    res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        name: user.name,
        surname: user.surname,
      },
      ...(!sessionData.isPersistent && { sessionId: sessionID }),
    });
  } catch (error) {
    Logger.error(`Error fetching session: ${error}`, DOMAIN);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies[SESSION_COOKIE];

  try {
    await sessionService.deleteSession(sessionId);

    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: Config.NODE_ENV === "production",
      sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
      domain:
        Config.NODE_ENV === "production" ? Config.COOKIE_DOMAIN : undefined,
    });

    res.status(200).json({
      message: "Succesfully logged out",
      code: "LOGOUT_SUCCESS",
    });
  } catch (error) {
    Logger.error(`Logout error: ${error}`, DOMAIN);
    res.status(500).json({
      message: "Failed to log out. Please try again later.",
      code: "LOGOUT_FAIL",
    });
  }
};

const authController = {
  login,
  verify,
  session,
  logout,
};

export default authController;
