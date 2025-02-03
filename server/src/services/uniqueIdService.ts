const Snowflake = require("snowflake-id").default;

const snowflake = new Snowflake({
  mid: 1, // unique machine id (for each instance)
  offset: (2025 - 1970) * 31536000 * 1000, // epoch
});

const generateUserId = () => {
  const snowflakeId = snowflake.generate() as number;
  return String(snowflakeId).slice(0, 9);
};

const generateChatId = () => {
  const snowflakeId = snowflake.generate() as number;
  return String(snowflakeId).slice(0, 10);
};

const generateGroupChatId = () => {
  const snowflakeId = snowflake.generate() as number;
  return `-${String(snowflakeId).slice(0, 9)}`;
};

const generateChannelId = () => {
  const snowflakeId = snowflake.generate() as number;
  return `-${String(snowflakeId).slice(0, 10)}`;
};

const uniqueIdService = {
  generateUserId,
  generateChatId,
  generateGroupChatId,
  generateChannelId,
};

export default uniqueIdService;
