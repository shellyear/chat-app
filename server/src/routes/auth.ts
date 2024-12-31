import express, { Request, Response } from "express";
import { generateCode } from "../utils/generateCode";
import User from "../models/User";
import smsService from "../services/smsService";
import redisClient from "../services/redisClient";
import {
  DEFAULT_EXPIRATION,
  PERSISTENT_EXPIRATION,
  SESSION_COOKIE,
} from "../constants/session";
import sessionService from "../services/sessionService";
import Config from "../config";
import Logger from "../logger";

const DOMAIN = "authRoutes";

const router = express.Router();

/* For both login and register to simplify the flow */
router.post(
  "/login",
  async (
    req: Request<
      {},
      {},
      {
        phoneNumber: string;
        keepMeSignedIn: boolean;
      }
    >,
    res
  ) => {
    const { phoneNumber, keepMeSignedIn } = req.body;

    try {
      const existingUser = await User.findOne({ phoneNumber });
      const verificationCode = generateCode();
      const expirationTime = keepMeSignedIn
        ? PERSISTENT_EXPIRATION
        : DEFAULT_EXPIRATION;

      if (existingUser) {
        await redisClient.set(phoneNumber, verificationCode, {
          EX: expirationTime,
        });

        await smsService.sendVerificationCode(phoneNumber, verificationCode);

        res.status(200).json({
          message: "Verification code sent to your phone",
          code: "VERIFICATION_CODE_SENT",
        });

        return;
      }

      await redisClient.set(phoneNumber, verificationCode, {
        EX: expirationTime,
      });

      const newUser = new User({ phoneNumber });
      await newUser.save();

      await smsService.sendVerificationCode(phoneNumber, verificationCode);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to send verification code",
        code: "VERIFICATION_CODE_SEND_FAIL",
      });
    }
  }
);

router.post(
  "/verify",
  async (
    req: Request<
      {},
      {},
      {
        phoneNumber: string;
        code: string;
        keepMeSignedIn: boolean;
      }
    >,
    res: Response
  ) => {
    const { phoneNumber, code, keepMeSignedIn } = req.body;

    try {
      const user = await User.findOne({ phoneNumber });

      if (!user) {
        /* This should not happen if the user always registers via the /login route first. */
        res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      const storedVerificationCode = await redisClient.get(phoneNumber);

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

        res.cookie(SESSION_COOKIE, newSessionId, {
          httpOnly: true,
          secure: Config.NODE_ENV === "production",
          sameSite: Config.NODE_ENV === "production" ? "none" : "strict",
          maxAge: keepMeSignedIn
            ? PERSISTENT_EXPIRATION * 1000
            : DEFAULT_EXPIRATION * 1000,
          domain:
            Config.NODE_ENV === "production" ? Config.COOKIE_DOMAIN : undefined,
        });

        res.status(200).json({
          message: "Verification successful",
          user: {
            id: user._id,
            phoneNumber: user.phoneNumber,
            username: user.username,
          },
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
  }
);

router.get("/session", async (req, res) => {
  try {
    const sessionID = req.cookies[SESSION_COOKIE];

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

    res.status(200).json({
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    Logger.error(`Error fetching session: ${error}`, DOMAIN);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
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

    res.redirect("/login");
  } catch (error) {
    Logger.error(`Logout error: ${error}`, DOMAIN);
    res.status(500).json({
      message: "Failed to log out. Please try again later.",
      code: "LOGOUT_FAIL",
    });
  }
});

export default router;
