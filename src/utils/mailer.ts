import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";
import config from "config";

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
log.info("smtp: ");
log.info(smtp);

const transporter = nodemailer.createTransport(smtp);

export default async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error("Error sending email");
            return;
        }
        log.info("Mail sent successfully");

        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
}

