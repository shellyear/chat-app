import express, { Request, Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";
import wsConnectionService from "../services/wsConnectionService";
import messageQueueService from "../services/messageQueueService";

const router = express.Router();

router.post(
  "/send/:id",
  async (
    req: Request<
      { id: string },
      {},
      {
        content: string;
      }
    >,
    res: Response
  ) => {
    const { id: recipientEmail } = req.params;
    const { content } = req.body;
    const { userId: senderId } = req.session;

    try {
      const recipient = await User.findOne({ email: recipientEmail });

      if (!recipient) {
        res.status(404).json({
          code: "RECIPIENT_NOT_FOUND",
          message: "Recipient not found",
        });
        return;
      }

      let chat = await Chat.findOne({
        participants: { $all: [senderId, recipient._id] },
      });

      if (!chat) {
        chat = await Chat.create({
          participantsIds: [senderId, recipient._id],
        });
      }

      const message = await Message.create({
        chatId: chat._id,
        senderId,
        content,
      });

      chat.lastMessageId = message._id;
      await chat.save();

      const recipientWs = await wsConnectionService.getConnection(
        recipient._id.toString()
      );

      if (recipientWs) {
        recipientWs.send(
          JSON.stringify({
            type: "NEW_MESSAGE",
            chatId: chat._id,
            message: {
              sender: senderId,
              content,
              timestamp: message.createdAt,
            },
          })
        );
      } else {
        await messageQueueService.addUndeliveredMessage(
          recipient._id.toString(),
          message
        );
      }
      res.status(201).send();
    } catch (error) {}
  }
);

export default router;
