import express from "express";
import authRoutes from "./auth";
import chatRoutes from "./chats";
import sessionMiddleware from "../middlewares/session";
import searchRoutes from "./search";
import contactRoutes from "./contact";
import userRoutes from "./user";
import uniqueNameRoutes from "./uniqueNames";
import { rateLimit } from "express-rate-limit";

const seachLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  limit: 120,
  message: "Too many search requests. Please try again later.",
});

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/chats", sessionMiddleware, chatRoutes);
router.use("/users", sessionMiddleware, userRoutes);
router.use("/uniqueNames", sessionMiddleware, uniqueNameRoutes);
router.use("/search", seachLimiter, sessionMiddleware, searchRoutes);
router.use("/contacts", sessionMiddleware, contactRoutes);

export default router;
