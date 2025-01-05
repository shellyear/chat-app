import http from "http";
import { WebSocketServer } from "ws";

const clients: Map<string, WebSocket> = new Map();

const setupWebsocketServer = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", function (ws, req: http.IncomingMessage) {});
};

const websocketService = {
  setupWebsocketServer,
};

export default websocketService;
