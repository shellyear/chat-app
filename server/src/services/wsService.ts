import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as cookie from "cookie";
import sessionService from "./sessionService";
import { SESSION_COOKIE } from "../constants/session";
import wsConnectionService from "./wsConnectionService";

const setupWebsocketServer = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: WebSocket, req: http.IncomingMessage) => {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionId =
      cookies[SESSION_COOKIE] || req.headers.authorization?.split(" ")[1];

    if (!sessionId) {
      ws.close(1008, "Unauthorized");
    }

    const sessionData = await sessionService.getSession(sessionId as string);

    if (!sessionData) {
      ws.close(1008, "Invalid session");
      return;
    }

    const { userId } = sessionData;

    await wsConnectionService.addConnection(userId, ws);

    ws.on("close", async () => {
      await wsConnectionService.removeConnection(userId);
    });

    ws.send(JSON.stringify({ message: "WebSocket connection authorized" }));
  });
};

const websocketService = {
  setupWebsocketServer,
};

export default websocketService;
