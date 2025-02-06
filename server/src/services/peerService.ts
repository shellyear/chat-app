import Config from "../config";
import { PEER_ID_RANGES } from "../constants/peer";
import { PeerTypes } from "../types/peer";

const { USER, GROUP_CHAT, CHANNEL, SECRET_CHAT } = PEER_ID_RANGES;

/* https://core.telegram.org/api/bots/ids */
const clientFacingIdToInternalId = (
  clientId: number
): { type: PeerTypes; id: number } => {
  if (clientId >= USER.MIN && clientId <= USER.MAX) {
    return { type: PeerTypes.USER, id: clientId };
  } else if (clientId >= GROUP_CHAT.MIN && clientId <= GROUP_CHAT.MAX) {
    return { type: PeerTypes.GROUP_CHAT, id: -clientId };
  } else if (clientId >= CHANNEL.MIN && clientId <= CHANNEL.MAX) {
    return { type: PeerTypes.CHANNEL, id: -clientId - 1000000000000 };
  } else if (clientId >= SECRET_CHAT.MIN && clientId <= SECRET_CHAT.MAX) {
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

/* Since Number.MAX_SAFE_INTEGER is big enough (9 quadrillions etc) the Number is used */
class SnowflakeIDGenerator {
  machineId: number; // Unique machine ID (0 to 1023)
  sequence: number;
  lastTimestamp: number;
  epoch: number;
  constructor(machineId = 0) {
    this.machineId = machineId;
    this.sequence = 0;
    this.lastTimestamp = -1;

    // Custom epoch (e.g., January 1, 2025)
    this.epoch = new Date("2025-01-01T00:00:00Z").getTime();
  }

  generate() {
    let timestamp = Date.now() - this.epoch;

    if (timestamp === this.lastTimestamp) {
      // Increment sequence number if within the same millisecond
      this.sequence = (this.sequence + 1) & 4095; // 12 bits for sequence
      if (this.sequence === 0) {
        // Wait for the next millisecond if sequence overflows
        while (timestamp <= this.lastTimestamp) {
          timestamp = Date.now() - this.epoch;
        }
      }
    } else {
      this.sequence = 0; // Reset sequence for a new millisecond
    }

    this.lastTimestamp = timestamp;

    // Combine timestamp, machine ID, and sequence into a 64-bit ID
    const id =
      (timestamp << 22) | // 42 bits for timestamp
      (this.machineId << 12) | // 10 bits for machine ID
      this.sequence; // 12 bits for sequence

    return id;
  }
}

class EntityIDGenerator {
  snowflake = new SnowflakeIDGenerator();
  constructor(machineId: number = 0) {
    this.snowflake = new SnowflakeIDGenerator(machineId);
  }

  /**
   * The modulo operation (id % maxUserId) ensures the result is always less than maxUserId
   * Adding 1 ensures the result is at least 1.
   */
  generateUserId() {
    const id = this.snowflake.generate();
    const maxUserId = 0xffffffffff; // 1,099,511,627,775
    return (id % maxUserId) + 1;
  }

  /**
   * The modulo operation ensures the result is less than maxChatId.
   * Adding 1 ensures the result is at least 1.
   */
  generateChatId() {
    const id = this.snowflake.generate();
    const maxChatId = 999_999_999_999;
    return (id % maxChatId) + 1;
  }

  /**
   * The modulo operation ensures the result is less than maxChannelId.
   * Adding 1n ensures the result is at least 1.
   */
  generateChannelId() {
    const id = this.snowflake.generate();
    const maxChannelId = 997852516352;
    return (id % maxChannelId) + 1;
  }

  // Generate a secret chat ID
  generateSecretChatId() {
    const id = this.snowflake.generate();
    const maxSecretChatId = 2147483647;
    const minSecretChatId = -2147483648;
    return (id % (maxSecretChatId - minSecretChatId + 1)) + minSecretChatId; // Ensure ID is within secret chat range
  }
}

const uniqueIdGenerator = new EntityIDGenerator(Config.MACHINE_ID);
const peerService = {
  clientFacingIdToInternalId,
  internalIdToClientFacingId,
  uniqueIdGenerator,
};

export default peerService;
