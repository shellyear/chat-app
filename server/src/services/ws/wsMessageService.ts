import Chat from "../../models/Chat";
import Message from "../../models/Message";
import { WebSocket } from "ws";
import wsConnectionService from "./wsConnectionService";
import { PrivateMessage, WebSocketOutgoingEvents } from "../../types/ws";
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

  const messagePayloadBase = {
    event: WebSocketOutgoingEvents.NEW_PRIVATE_MESSAGE,
    senderId: currentUserId,
    content: message.content,
    createdAt: message.createdAt,
  };

  const currentUserPayload = {
    ...messagePayloadBase,
    peerId: recipientId,
  };

  const recipientPayload = {
    ...messagePayloadBase,
    peerId: currentUserId,
  };

  const recipienWs = wsConnectionService.getConnection(recipientId);

  if (recipienWs) {
    recipienWs.send(JSON.stringify(recipientPayload));
  } else {
    messageQueueService.addUndeliveredMessage(recipientId, recipientPayload);
  }

  /* send message to the sender to ensure that the message is synced across all sender devices  */
  ws.send(JSON.stringify(currentUserPayload));
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
