import { Request, Response } from "express";
import peerService from "../services/peerService";
import UniqueName, { IUniqueName } from "../models/UniqueName";
import userService from "../services/userService";
import { PeerTypes } from "../types/peer";

const getPeerById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { userId } = req.session;

  let peerInfo = null;

  if (id.startsWith("@")) {
    const uniqueNameDoc: IUniqueName | null = await UniqueName.findOne({
      uniqueName: id.slice(1),
    });

    if (!uniqueNameDoc) {
      res.status(404).json({
        code: "PEER_NOT_FOUND",
      });
      return;
    }

    const lookupUserId = uniqueNameDoc.referenceId;

    if (uniqueNameDoc.type === PeerTypes.USER) {
      const foundUser = await userService.getUserWithContactOverride(
        userId,
        lookupUserId
      );

      if (foundUser) {
        peerInfo = {
          profilePicture: foundUser.profilePicture,
          uniqueName: foundUser.uniqueName,
          name: foundUser.surname
            ? `${foundUser.name} ${foundUser.surname}`
            : foundUser.name,
          bio: foundUser.bio,
          email: foundUser.email ? foundUser.email : undefined,
        };
      }
    }

    if (uniqueNameDoc.type === PeerTypes.GROUP_CHAT) {
      // TODO: return groupInfo
    }

    if (uniqueNameDoc.type === PeerTypes.CHANNEL) {
      // TODO: return channelInfo
    }
  }

  const isNumberId = !isNaN(Number(id)) && !isNaN(parseFloat(id));

  if (isNumberId) {
    const { type, id: internalId } = peerService.clientFacingIdToInternalId(
      Number(id)
    );

    if (type === PeerTypes.USER) {
      const foundUser = await userService.getUserWithContactOverride(
        userId,
        internalId
      );

      if (foundUser) {
        peerInfo = {
          profilePicture: foundUser.profilePicture,
          uniqueName: foundUser.uniqueName,
          name: foundUser.surname
            ? `${foundUser.name} ${foundUser.surname}`
            : foundUser.name,
          bio: foundUser.bio,
          email: foundUser.email ? foundUser.email : undefined,
        };
      }
    }

    if (type === PeerTypes.GROUP_CHAT) {
      // TODO
    }

    if (type === PeerTypes.CHANNEL) {
      // TODO
    }
  }

  if (!peerInfo) {
    res.status(404).json({
      code: "PEER_NOT_FOUND",
    });
    return;
  }

  res.status(200).json({
    code: "GET_PEER_INFO_SUCCESS",
    data: peerInfo,
  });
};

const peerController = {
  getPeerById,
};

export default peerController;
