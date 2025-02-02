export interface IChannel {
  channelId: number
  name: string
  uniqueName: string
  description?: string
  subscribers: string[] // userId[]
}
