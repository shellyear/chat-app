import nodemailer from "nodemailer";
import Config from "../config";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Config.SMTP_USER,
    pass: Config.SMTP_PASS,
  },
});

const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  const mailOptions = {
    from: Config.SMTP_USER,
    to: email,
    subject: "Verify your email",
    html: `
          <div>
            <p>Your verification code for Chatogram is <b>${verificationCode}</b> </p>
          </div>
        `,
  };
  await transporter.sendMail(mailOptions);
};

const emailService = {
  sendVerificationEmail,
};

export default emailService;
