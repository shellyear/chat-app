import express from "express";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get("/", chatController.getChats);
router.get("/:id", chatController.getChat);
router.get("/:chatId/messages", chatController.getMessages);

export default router;
