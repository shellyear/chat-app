import http from "http";
import { WebSocketEvents, WebSocketMessage } from "../types/ws";
import { WebSocket } from "ws";
import { ISessionData } from "../types/session";
import messageService from "../services/messageService";
import wsConnectionService from "../services/wsConnectionService";
import Logger from "../logger";

const DOMAIN = "wsController";

const handleConnection = async (
  ws: WebSocket,
  req: http.IncomingMessage,
  sessionData: ISessionData
) => {
  await wsConnectionService.addConnection(sessionData.userId, ws);
  await wsConnectionService.handleUserReconnect(sessionData.userId, ws);

  ws.on("message", async (data) => {
    try {
      const parsedData: WebSocketMessage = JSON.parse(data.toString());

      if (
        ![
          WebSocketEvents.SEND_PRIVATE_MESSAGE,
          WebSocketEvents.SEND_GROUP_MESSAGE,
          WebSocketEvents.SEND_CHANNEL_MESSAGE,
          WebSocketEvents.SEND_SECRET_MESSAGE,
        ].includes(parsedData.event)
      ) {
        Logger.error(`Unknown socket event ${parsedData.event}`, DOMAIN);
      }

      switch (parsedData.event) {
        case WebSocketEvents.SEND_PRIVATE_MESSAGE:
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
  });
};

export default {
  handleConnection,
};
