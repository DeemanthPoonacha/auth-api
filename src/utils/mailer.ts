import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";
import config from "config";
import { UserInDb } from "../types/user";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  verificationEmailTemplate,
  passwordResetEmailTemplate,
} from "../templates/emails";

const senderMailId = config.get<string>("senderMailId");

async function generateTestCreds() {
  const testCreds = await nodemailer.createTestAccount();
  console.log(`Test credentials:`, testCreds);
  return testCreds;
}

// generateTestCreds();
const smtp = config.get<SMTPTransport.Options>("smtp");
log.info("smtp: ");
log.info(smtp);

const transporter = nodemailer.createTransport(smtp);

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err: any, info: any) => {
    if (err) {
      log.error("Error sending email");
      log.error(err);
      return;
    }
    log.info("Mail sent successfully");

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export async function sendVerificationMail(user: UserInDb) {
  const serverOrigin = config.get("serverOrigin");
  const verificationUrl = `${serverOrigin}/api/users/${user._id}/verify/${user.verificationCode}`;

  await sendEmail({
    from: senderMailId,
    to: user.email,
    subject: "Verify Your Email Address - Complete Your Registration",
    html: verificationEmailTemplate(verificationUrl),
  });
}

export async function sendPasswordResetMail(
  user: UserInDb,
  passwordResetCode: string
) {
  const frontendOrigin = config.get("clientOrigin");
  const resetUrl = `${frontendOrigin}/auth/resetPassword/${user._id}/${passwordResetCode}`;

  await sendEmail({
    from: senderMailId,
    to: user.email,
    subject: "Reset Your Password - Secure Your Account",
    html: passwordResetEmailTemplate(resetUrl),
  });
}
