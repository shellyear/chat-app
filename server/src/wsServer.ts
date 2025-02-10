import http from "http";
import { WebSocketServer } from "ws";
import * as cookie from "cookie";
import sessionService from "./services/sessionService";
import { SESSION_COOKIE } from "./constants/session";
import internal from "stream";
import wsController from "./controllers/wsController";

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

  wss.on("connection", wsController.handleConnection);
};

export default setupWebsocketServer;
