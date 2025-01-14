import express from "express";
import authRoutes from "./auth";
import chatRoutes from "./chats";
import sessionMiddleware from "../middlewares/session";

const router = express.Router();

router.use("/auth", sessionMiddleware, authRoutes);
router.use("/chats", sessionMiddleware, chatRoutes);

export default router;
