export interface IGroupChat {
  groupChatId: number;
  name: string;
  uniqueName?: string;
  description: string;
  members: number[];
  createdAt: Date;
  updatedAt: Date;
}
