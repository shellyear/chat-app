import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/User";
import Logger from "../logger";

const DOMAIN = "userController";

type Username = string; /* @username */
type UserId = Types.ObjectId | Username;

const getUser = async (
  req: Request<{
    id: UserId;
  }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      $or: [{ _id: id }, { username: id }],
    });

    if (!user) {
      res.status(404).json({
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      code: "GET_USER_SUCCESS",
      data: user,
    });
  } catch (error) {
    Logger.error(`Error while fetching user ${error}`, DOMAIN);
    res.status(500).json({ code: "GET_USER_ERRO", error });
  }
};

const userController = {
  getUser,
};

export default userController;
