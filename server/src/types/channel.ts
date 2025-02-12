export interface IChannel {
  channelId: number;
  name: string;
  uniqueName: string;
  description?: string;
  subscribers: number[];
  createdAt: Date;
  updatedAt: Date;
}
