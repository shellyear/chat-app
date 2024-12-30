import "dotenv/config";

const Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: 3000,
  MONGO_URL: "mongodb://localhost:27017/chatapp",
  TWILLIO_SID: process.env.TWILLIO_SID || "twillio_sid",
  TWILLIO_AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN || "twillio_auth_token",
  TWILLIO_PHONE_NUMBER:
    process.env.TWILLIO_PHONE_NUMBER || "twillio_phone_number",
  COOKIE_DOMAIN: "api.chatapp.one",
  REDIS_PUBLIC_ENDPOINT:
    process.env.REDIS_PUBLIC_ENDPOINT || "host_port_endpoint",
  REDIS_USER_PASSWORD: process.env.REDIS_USER_PASSWORD || "redis_user_password",
};

console.log({ Config });

export default Config;
