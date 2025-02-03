export type IFoundContact = {
  name: string;
  surname?: string;
  contactId: string;
  contactDetails: {
    uniqueName?: string;
    profilePicture?: string;
  };
};
