import http from "http";
import { WebSocketIncomingEvents, WebSocketMessage } from "../types/ws";
import { WebSocket } from "ws";
import { ISessionData } from "../types/session";
import messageService from "../services/ws/wsMessageService";
import Logger from "../logger";
import pubsubService from "../services/pubsubService";
import wsConnectionService from "../services/ws/wsConnectionService";

const DOMAIN = "wsController";

const handleConnection = async (
  ws: WebSocket,
  req: http.IncomingMessage,
  sessionData: ISessionData
) => {
  await wsConnectionService.addConnection(sessionData.userId, ws);
  // await pubsubService.subscribeToUserChannel(sessionData.userId, ws);

  ws.on("message", async (data) => {
    try {
      const parsedData: WebSocketMessage = JSON.parse(data.toString());

      if (
        ![
          WebSocketIncomingEvents.SEND_PRIVATE_MESSAGE,
          WebSocketIncomingEvents.SEND_GROUP_MESSAGE,
          WebSocketIncomingEvents.SEND_CHANNEL_MESSAGE,
          WebSocketIncomingEvents.SEND_SECRET_MESSAGE,
        ].includes(parsedData.event)
      ) {
        Logger.error(`Unknown socket event ${parsedData.event}`, DOMAIN);
      }

      switch (parsedData.event) {
        case WebSocketIncomingEvents.SEND_PRIVATE_MESSAGE:
          await messageService.sendPrivateMessage(
            parsedData,
            sessionData.userId,
            ws
          );
          break;
        /* TODO: handler other ws msg event here */
      }
    } catch (error) {
      Logger.error(`Error while handling 'message' event: ${error}`, DOMAIN);
    }
  });

  ws.on("close", async () => {
    await wsConnectionService.removeConnection(sessionData.userId);
    Logger.info(`WebSocket closed for user ${sessionData.userId}`, DOMAIN);
  });
};

export default {
  handleConnection,
};
