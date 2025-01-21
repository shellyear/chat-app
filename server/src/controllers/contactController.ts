import { Request, Response } from "express";
import Contact from "../models/Contact";
import User from "../models/User";
import Logger from "../logger";

const DOMAIN = "contactController";

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
    res.status(201).json({ code: "CONTACT_ADDED", data: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact" });
    return;
  }
};

const getContacts = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  try {
    const contacts = await Contact.find({ userId })
      .populate("contactId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ code: "FOUND_CONTACTS_SUCCESS", data: contacts });
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

const getContact = async (req: Request, res: Response) => {
  const { id: contactId } = req.params;
  const { userId } = req.session;

  try {
    const contact = await Contact.findOne({
      userId,
      contactId,
    }).populate("contactId", "username profilePicture photos bio");

    if (!contact) {
      res.status(404).json({
        code: "CONTACT_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      code: "GET_CONTACT_SUCCESS",
      data: contact,
    });
  } catch (error) {
    Logger.error(`Error while getting a contact ${error}`, DOMAIN);
    res.status(500).json({ code: "SERVER_ERROR" });
  }
};

const contactController = {
  addContact,
  getContacts,
  getContact,
  deleteContact,
};

export default contactController;
