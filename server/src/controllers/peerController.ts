import { Request, Response } from "express";


const getPeerById = (req: Request<{ id: string }>, res: Response) => {
  let { id } = req.params

  if (id.startsWith('@')) {
    // find in UniqueName
  }

  const isNumberId = !isNaN(Number(id)) && !isNaN(parseFloat(id))
  if (isNumberId) {
    // find by determin
  }

};

const peerController = {
  getPeerById,
};

export default peerController;
