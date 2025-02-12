import * as express from "express";
import { ISessionData } from "../../src/types/session";

declare global {
  namespace Express {
    interface Request {
      session: ISessionData;
    }
  }
}
