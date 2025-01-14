import * as express from "express";
import { ISessionData } from "../../src/services/sessionService";

declare global {
  namespace Express {
    interface Request {
      session: ISessionData;
    }
  }
}
