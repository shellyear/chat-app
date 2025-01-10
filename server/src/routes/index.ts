import express from "express";
import authRoutes from "./auth";
import chatRoutes from './chats'

const router = express.Router();

router.use("/auth", authRoutes);
router.use('/chats', chatRoutes)

export default router;
