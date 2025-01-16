import express from "express";
import authRoutes from "./auth";
import chatRoutes from "./chats";
import sessionMiddleware from "../middlewares/session";
import searchRoutes from "./search";

import { rateLimit } from "express-rate-limit";

const seachLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  limit: 120,
  message: "Too many search requests. Please try again later.",
});

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/chats", sessionMiddleware, chatRoutes);
router.use("/search", seachLimiter, sessionMiddleware, searchRoutes);

export default router;
