const Snowflake = require("snowflake-id").default;
const base62 = require("base62");

const snowflake = new Snowflake({
  mid: 1, // unique machine id (for each instance)
  offset: 0, // epoch
});

const generateUserId = () => {
  const snowflakeId = snowflake.generate();
  return base62.encode(snowflakeId).slice(0, 10);
};

const generateChatId = () => {
  const snowflakeId = snowflake.generate();
  return base62.encode(snowflakeId).slice(0, 9);
};

const generateGroupChatId = () => {
  const snowflakeId = snowflake.generate();
  return `-${base62.encode(snowflakeId).slice(0, 9)}`;
};

const generateChannelId = () => {
  const snowflakeId = snowflake.generate();
  return `-${base62.encode(snowflakeId).slice(0, 10)}`;
};

const uniqueIdService = {
  generateUserId,
  generateChatId,
  generateGroupChatId,
  generateChannelId,
};

export default uniqueIdService;
