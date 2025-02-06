import { PeerTypes } from "../types/peer";

/* https://core.telegram.org/api/bots/ids */
const clientFacingIdToInternalId = (
  clientId: number
): { type: PeerTypes; id: number } => {
  if (clientId >= 1 && clientId <= 0xffffffffff) {
    return { type: PeerTypes.USER, id: clientId };
  } else if (clientId >= -999999999999 && clientId <= -1) {
    return { type: PeerTypes.GROUP_CHAT, id: -clientId };
  } else if (clientId >= -1997852516352 && clientId <= -1000000000001) {
    return { type: PeerTypes.CHANNEL, id: -clientId - 1000000000000 };
  } else if (clientId >= -2002147483648 && clientId <= -1997852516353) {
    return { type: PeerTypes.SECRET_CHAT, id: clientId + 2000000000000 };
  } else {
    throw new Error("Invalid Bot API Dialog ID");
  }
};

function internalIdToClientFacingId(type: PeerTypes, internalId: number) {
  switch (type) {
    case PeerTypes.USER:
      return internalId;
    case PeerTypes.GROUP_CHAT:
      return -internalId;
    case PeerTypes.CHANNEL:
      return -(1_000_000_000_000 + internalId);
    case PeerTypes.SECRET_CHAT:
      return internalId - 2_000_000_000_000; // Subtract 2 trillion
    default:
      throw new Error("Invalid entity type");
  }
}

const peerService = {
  clientFacingIdToInternalId,
  internalIdToClientFacingId,
};

export default peerService;
