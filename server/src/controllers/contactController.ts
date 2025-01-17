import { Request, Response } from "express";
import Contact from "../models/Contact";
import User from "../models/User";

const addContact = async (
  req: Request<
    {},
    {},
    {
      name: string;
      email: string;
      surname?: string;
    }
  >,
  res: Response
) => {
  const { name, email, surname } = req.body;
  const { userId } = req.session;

  if (!name || !email) {
    res.status(400).json({
      code: "CONTACT_INFO_REQUIRED",
      message: "Name and email are required",
    });
    return;
  }

  try {
    const existingContact = await Contact.findOne({
      userId,
      contactId: { $ne: userId },
      email,
    });

    if (existingContact) {
      res.status(400).json({
        code: "CONTACT_EXISTS",
        message: "This contact already exists",
      });
      return;
    }

    const foundUserContact = await User.findOne({ email });
    if (!foundUserContact) {
      res.status(404).json({ message: "User with this email not found" });
      return;
    }

    const newContact = new Contact({
      userId,
      contactId: foundUserContact._id,
      name,
      email,
      surname,
    });

    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact added successfully", data: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact" });
    return;
  }
};

const getContacts = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  try {
    const contacts = await Contact.find({ userId })
      .populate("contactId", "email username name surname")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "FOUND_CONTACTS_SUCCESS", data: contacts });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
    return;
  }
};

const deleteContact = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const contactId = req.params.id;

  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.status(200).json({
      code: "CONTACT_DELETE_SUCCESS",
      message: "Contact deleted successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      code: "ERROR_DELETE_CONTACT",
      message: "Error deleting contact",
    });
    return;
  }
};

const contactController = {
  addContact,
  getContacts,
  deleteContact,
};

export default contactController;
