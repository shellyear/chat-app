import Logger, { LogLevel } from "./logger";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes";
import Config from "./config";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import websocketServer from "./wsServer";

Logger.init(LogLevel.DEBUG);

const DOMAIN = ".";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: Config.FRONT_END_BASE_URL,
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(Config.MONGO_URL)
  .then(() => {
    Logger.info(`Connected to Mongodb on ${Config.MONGO_URL}`, DOMAIN);
  })
  .catch((err) => {
    Logger.error(`Failed to connect to ${Config.MONGO_URL}, ${err}`, DOMAIN);
  });

const httpServer = app.listen(Config.PORT, () => {
  app.use("/api", routes);
  Logger.info(`Server is listening on port ${Config.PORT}`, DOMAIN);
});

websocketServer(httpServer);
