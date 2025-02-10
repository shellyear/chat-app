import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as cookie from "cookie";
import sessionService, { ISessionData } from "./sessionService";
import { SESSION_COOKIE } from "../constants/session";
import wsConnectionService from "./wsConnectionService";
import internal from "stream";
import { WebSocketEvents, WebSocketMessage } from "../types/ws";

const setupWebsocketServer = (server: http.Server) => {
  const wss = new WebSocketServer({ noServer: true });

  /* handle Websocket handshake manually */
  server.on(
    "upgrade",
    async (
      req: http.IncomingMessage,
      socket: internal.Duplex,
      head: Buffer
    ) => {
      const cookies = cookie.parse(req.headers.cookie || "");
      const sessionId =
        cookies[SESSION_COOKIE] || req.headers.authorization?.split(" ")[1];

      if (!sessionId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }

      const sessionData = await sessionService.getSession(sessionId);

      if (!sessionData) {
        socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (websocket) => {
        wss.emit("connection", websocket, req, sessionData);
      });
    }
  );

  wss.on(
    "connection",
    async (
      ws: WebSocket,
      req: http.IncomingMessage,
      sessionData: ISessionData
    ) => {
      await wsConnectionService.addConnection(sessionData.userId, ws);
      await wsConnectionService.handleUserReconnect(sessionData.userId, ws);

      ws.on("message", async (data) => {
        const parsedData: WebSocketMessage = JSON.parse(data.toString());

        if (parsedData.event === WebSocketEvents.SEND_PRIVATE_MESSAGE) {
          console.log("private msg recieved");
        }
      });

      ws.on("close", async () => {
        await wsConnectionService.removeConnection(sessionData.userId);
      });

      ws.send(JSON.stringify({ message: "WebSocket connection authorized" }));
    }
  );
};

const websocketService = {
  setupWebsocketServer,
};

export default websocketService;
