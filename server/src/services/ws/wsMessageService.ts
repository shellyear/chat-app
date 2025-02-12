import Chat from "../../models/Chat";
import Message from "../../models/Message";
import { WebSocket } from "ws";
import wsConnectionService from "./wsConnectionService";
import { PrivateMessage, WebSocketEvents } from "../../types/ws";
import messageQueueService from "../messageQueueService";

const sendPrivateMessage = async (
  msg: PrivateMessage,
  currentUserId: number,
  ws: WebSocket
) => {
  const { peerId: recipientId, content } = msg;

  let chat = await Chat.findOne({
    participantsIds: { $all: [currentUserId, recipientId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participantsIds: [currentUserId, recipientId],
    });
  }

  const message = await Message.create({
    chatId: chat._id,
    senderId: currentUserId,
    content,
    timestamp: new Date(),
  });

  chat.lastMessageId = message._id;
  chat.save();

  const messagePayload = {
    event: WebSocketEvents.NEW_PRIVATE_MESSAGE,
    content: message.content,
    senderId: message.senderId,
    createdAt: message.createdAt,
  };
  const messagePayloadJson = JSON.stringify(messagePayload);

  const recipienWs = wsConnectionService.getConnection(recipientId);

  if (recipienWs) {
    recipienWs.send(messagePayloadJson);
  } else {
    messageQueueService.addUndeliveredMessage(recipientId, messagePayload);
  }

  /* send message to the sender to ensure that the message is synced across all sender devices  */
  ws.send(messagePayloadJson);
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
