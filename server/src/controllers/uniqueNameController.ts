import { Request, Response } from "express";
import UniqueName from "../models/UniqueName";

const checkUniqueNameAvailability = async (
  req: Request<
    {},
    {},
    {
      uniqueName: string;
    }
  >,
  res: Response
) => {
  const { uniqueName } = req.body;

  const uniqueNameTaken = await UniqueName.exists({ uniqueName });

  if (uniqueNameTaken) {
    res.status(409).json({
      code: "UNIQUE_NAME_TAKEN",
    });
    return;
  }

  res.status(200).json({
    code: "UNIQUE_NAME_NOT_TAKEN",
  });
};

const uniqueNameController = {
  checkUniqueNameAvailability,
};

export default uniqueNameController;
