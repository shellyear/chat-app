export interface IContact {
  userId: number;
  contactId: number;
  name: string;
  email: string;
  surname?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IFoundContact = {
  name: string;
  surname?: string;
  contactId: string;
  contactDetails: {
    uniqueName?: string;
    profilePicture?: string;
  };
};
