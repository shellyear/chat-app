import { Types } from "mongoose";

export interface IChat {
  participantsIds: number[];
  lastMessageId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
