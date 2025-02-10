import Chat from "../models/Chat";
import Message from "../models/Message";
import { WebSocket } from "ws";
import wsConnectionService from "./wsConnectionService";
import { PrivateMessage } from "../types/ws";
import messageQueueService from "./messageQueueService";

const sendPrivateMessage = async (
  data: PrivateMessage,
  currentUserId: number,
  ws: WebSocket
) => {
  const { peerId: recipientId, content } = data;

  let chat = await Chat.findOne({
    participants: { $all: [currentUserId, recipientId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [currentUserId, recipientId],
      createdAt: new Date(),
    });
  }

  const message = await Message.create({
    chatId: chat._id,
    senderId: currentUserId,
    content,
    timestamp: new Date(),
  });

  /* send message to the sender to ensure that the message is synced across all sender devices  */
  ws.send(JSON.stringify({ event: "newMessage", message }));

  const recipientWs = await wsConnectionService.getConnection(recipientId);

  if (recipientWs) {
    recipientWs.send(JSON.stringify({ event: "newMessage", message }));
  } else {
    await messageQueueService.addUndeliveredMessage(recipientId, message);
  }
};

const broadcastMessage = async (userIds: number[], message: any) => {
  for (const userId of userIds) {
    const userWs = await wsConnectionService.getConnection(userId);
    if (userWs) {
      userWs.send(JSON.stringify({ event: "newMessage", message }));
    }
  }
};

export default {
  sendPrivateMessage,
};
