export type IContact = {
  userId: string
  contactId: { _id: string; username?: string; email: string; profilePicture?: string; photos: [] }
  name: string
  email: string
  surname?: string
  createdAt: Date
  updatedAt: Date
}
