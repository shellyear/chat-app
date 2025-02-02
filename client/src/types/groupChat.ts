export interface IGroupChat {
  _id: string
  groupChatId: string
  name: string
  uniqueName?: string
  description: string
  members: string[] // userId[]
}
