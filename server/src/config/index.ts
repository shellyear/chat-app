import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

const envFile = `.env.${NODE_ENV}`;
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 5000;

const Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  SMTP_USER: process.env.SMTP_USER || "smtp_user",
  SMTP_PASS: process.env.SMTP_PASS || "smtp_pass",
  PORT: 5000,
  API_BASE_URL: isProd
    ? process.env.API_BASE_URL
    : `${process.env.API_BASE_URL}:${PORT}`,
  FRONT_END_BASE_URL: process.env.FRONT_END_BASE_URL || "http://localhost:3000",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/chatapp",
  COOKIE_DOMAIN: "api.chatapp.one",
  REDIS_PUBLIC_ENDPOINT:
    process.env.REDIS_PUBLIC_ENDPOINT || "host_port_endpoint",
  REDIS_USER_PASSWORD: process.env.REDIS_USER_PASSWORD || "redis_user_password",
  TWILLIO_SID: process.env.TWILLIO_SID || "twillio_sid",
  TWILLIO_AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN || "twillio_auth_token",
  TWILLIO_PHONE_NUMBER:
    process.env.TWILLIO_PHONE_NUMBER || "twillio_phone_number",
};

console.log({ Config });

export default Config;
