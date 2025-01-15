import { Request, Response } from "express";
import User from "../models/User";
import Logger from "../logger";

const DOMAIN = "searchController";

const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  try {
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("username email profilePicture");

    res.status(200).json({
      code: "FOUND_USERS",
      data: users,
    });
  } catch (error) {
    Logger.error(`Error during search: ${error}`, DOMAIN);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchController = {
  searchUsers,
};

export default searchController;
