export type IContact = {
  userId: string
  contactId: { _id: string; username?: string; profilePicture?: string; photos: [] }
  name: string
  email: string
  surname?: string
  createdAt: Date
  updatedAt: Date
}

export type IFoundContact = {
  name: string
  surname?: string
  contactId: string
  contactDetails: {
    uniqueName?: string
    profilePicture?: string
  }
}
