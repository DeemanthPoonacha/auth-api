import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";
import config from "config";
import { senderMailId } from "../controllers/user.controller";
import { UserInDb } from "../types/user";

async function generateTestCreds() {
    const testCreds = await nodemailer.createTestAccount();
    console.log(`Test credentials:`, testCreds);
    return testCreds;
}

// generateTestCreds();
const smtp = config.get<{
    auth: {
        user: string;
        pass: string;
    };
    host: string;
    port: number;
    secure: boolean;
}>("smtp");
// log.info("smtp: ");
// log.info(smtp);

const transporter = nodemailer.createTransport(smtp);

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
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
    await sendEmail({
        from: senderMailId,
        to: user.email,
        subject: "Please verify your account",
        html: `<p>To verify your email address, <a href="http://localhost:8080/api/users/${user._id}/verify/${user.verificationCode}">Click Here</a>.</p>`,
    });
}

export async function sendPasswordResetMail(
    user: UserInDb,
    passwordResetCode: string
) {
    const frontendOrigin = config.get("origin");
    await sendEmail({
        from: senderMailId,
        to: user.email,
        subject: "Password reset email",
        html: `<p>To reset your password, <a href="${frontendOrigin}/auth/resetPassword/${user._id}/${passwordResetCode}">Click Here</a>.</p>`,
    });
}
