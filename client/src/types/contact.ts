export type IContact = {
  userId: string
  contactId: { _id: string; username?: string; profilePicture?: string; photos: [] }
  name: string
  email: string
  surname?: string
  createdAt: Date
  updatedAt: Date
}

export type IContactPreview = {
  userId: string
  contactId: { _id: string; username?: string; profilePicture?: string }
  name: string
  email: string
  surname?: string
  createdAt: Date
  updatedAt: Date
}
