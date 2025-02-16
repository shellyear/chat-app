import { Request, Response } from "express";
import User from "../models/User";
import { generateCode } from "../utils/generateCode";
import {
  DEFAULT_EXPIRATION,
  PERSISTENT_EXPIRATION,
  SESSION_COOKIE,
} from "../constants/session";
import { redisClient } from "../services/redisClients";
import emailService from "../services/emailService";
import sessionService from "../services/sessionService";
import Config from "../config";
import Logger from "../logger";
import userService from "../services/userService";

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
    const storedVerificationCode = await redisClient.get(email);

    if (!storedVerificationCode) {
      res.status(400).json({
        message: "Verification code has expired",
        code: "CODE_EXPIRED",
      });
      return;
    }

    if (storedVerificationCode !== code) {
      res.status(400).json({
        message: "Invalid verification code",
        code: "INVALID_VERIFICATION_CODE",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      /* User then proceeds to the setupProfilePage to create an account */
      res.status(200).json({
        code: "SET_ACCOUNT_INFO",
        message: "Verification successful, please set your account info",
      });
      return;
    }

    const newSessionId = await sessionService.createSession({
      userId: user.userId,
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
      code: "VERIFICATION_SUCCESS",
      user: {
        userId: user.userId,
        email: user.email,
        profilePicture: user.profilePicture,
        name: user.name,
        surname: user.surname,
      },
      ...(!keepMeSignedIn && { sessionId: newSessionId }),
    });
  } catch (error) {
    Logger.error(`Error while verifying code: ${error}`, DOMAIN);
    res.status(500).json({
      message: "Failed to verify code",
      code: "INVALID_VERIFICATION_CODE",
    });
  }
};

const setupAccount = async (
  req: Request<
    {},
    {},
    {
      email: string;
      name: string;
      surname?: string;
      keepMeSignedIn: string;
    }
  >,
  res: Response
) => {
  const { email, name, surname } = req.body;
  const keepMeSignedIn: boolean = JSON.parse(req.body.keepMeSignedIn);
  const profilePicture: Express.Multer.File | undefined = req.file;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
        code: "USER_ALREADY_EXISTS",
      });
      return;
    }

    const newUser = await userService.createUser({
      email,
      name,
      surname,
      profilePicture,
    });

    const newSessionId = await sessionService.createSession({
      userId: newUser.userId,
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
      code: "SETUP_ACCOUNT_SUCCESS",
      message: "Account setup complete, you are now signed in",
      user: {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        uniqueName: newUser.uniqueName,
        profilePicture: newUser.profilePicture,
      },
      ...(!keepMeSignedIn && { sessionId: newSessionId }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to set up profile",
      code: "PROFILE_SETUP_FAILED",
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

    const user = await User.findOne({ userId: sessionData.userId });

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await sessionService.refreshSession(sessionID, sessionData.isPersistent);

    res.status(200).json({
      user: {
        userId: user.userId,
        email: user.email,
        profilePicture: user.profilePicture,
        name: user.name,
        surname: user.surname,
        uniqueName: user.uniqueName,
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
  setupAccount,
  session,
  logout,
};

export default authController;
