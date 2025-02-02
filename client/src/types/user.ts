export interface IUser {
  userId: string
  name: string // required by default, set upon registration
  email: string // // required by default, set upon registration
  uniqueName?: string
  bio?: string
  surname?: string
  profilePicture?: string
}
