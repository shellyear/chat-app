export interface IChannel {
  channelId: string
  name: string
  uniqueName: string
  description?: string
  subscribers: string[] // userId[]
}
