import express from "express";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get("/", chatController.getChats);
router.post("/send/:id", chatController.sendMessage);

export default router;
