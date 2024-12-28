import express, { Request, Response } from "express";
import { generateCode } from "../utils/generateCode";
import User from "../models/User";
import smsService from "../services/smsService";

const router = express.Router();

router.post(
  "/register",
  async (
    req: Request<
      {},
      {},
      {
        phoneNumber: string;
      }
    >,
    res
  ) => {
    const { phoneNumber } = req.body;

    try {
      const verificationCode = generateCode();

      const user = new User({ phoneNumber, verificationCode });
      await user.save();

      await smsService.sendVerificationCode(phoneNumber, verificationCode);

      res.status(200).json({
        message: "Verification code sent to your phone",
        code: "VERIFICATION_CODE_SENT",
      });
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
      }
    >,
    res: Response
  ) => {
    const { phoneNumber, code } = req.body;

    try {
      const user = await User.findOne({ phoneNumber });

      if (!user) {
        res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      if (user.verificationCode === code) {
        user.verified = true;
        user.verificationCode = undefined;
        await user.save();

        res.status(200).json({
          message: "User verified successfully",
          code: "VERIFY_SUCCESS",
        });
      } else {
        res.status(400).json({
          message: "Invalid verification code",
          code: "INVALID_VERIFICATION_CODE",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to verify code",
        code: "INVALID_VERIFICATION_CODE",
      });
    }
  }
);

export default router;
