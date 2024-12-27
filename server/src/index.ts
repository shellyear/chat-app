import Logger, { LogLevel } from "./logger";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes";
import Config from "./config";

Logger.init(LogLevel.DEBUG);

const DOMAIN = ".";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

mongoose.connect(Config.MONGO_URL).then(() => {
  Logger.info(`Connected to Mongodb on ${Config.MONGO_URL}`, DOMAIN);
});

app.listen(Config.PORT, () => {
  app.use("/api", routes);
  Logger.info(`Server is listening on port ${Config.PORT}`, DOMAIN);
});
