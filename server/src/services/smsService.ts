import twilio from "twilio";
import Config from "../config";
import Logger from "../logger";

const DOMAIN = "smsService";

const client = twilio(Config.TWILLIO_SID, Config.TWILLIO_AUTH_TOKEN);

export const sendVerificationCode = async (
  phoneNumber: string,
  code: string
) => {
  try {
    const message = await client.messages.create({
      body: `Your verification code is ${code}`,
      from: Config.TWILLIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    Logger.info(`Verification code sent: ${message.sid}`, DOMAIN);
  } catch (error) {
    Logger.error(`Error sending verification code: ${error}`, DOMAIN);
  }
};

const smsService = {
  sendVerificationCode,
};

export default smsService;
