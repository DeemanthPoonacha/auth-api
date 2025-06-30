"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationMail = sendVerificationMail;
exports.sendPasswordResetMail = sendPasswordResetMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("config"));
const emails_1 = require("../templates/emails");
const senderMailId = config_1.default.get("senderMailId");
function generateTestCreds() {
    return __awaiter(this, void 0, void 0, function* () {
        const testCreds = yield nodemailer_1.default.createTestAccount();
        console.log(`Test credentials:`, testCreds);
        return testCreds;
    });
}
// generateTestCreds();
const smtp = config_1.default.get("smtp");
logger_1.default.info("smtp: ");
logger_1.default.info(smtp);
const transporter = nodemailer_1.default.createTransport(smtp);
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        transporter.sendMail(payload, (err, info) => {
            if (err) {
                logger_1.default.error("Error sending email");
                logger_1.default.error(err);
                return;
            }
            logger_1.default.info("Mail sent successfully");
            logger_1.default.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        });
    });
}
function sendVerificationMail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverOrigin = config_1.default.get("serverOrigin");
        const verificationUrl = `${serverOrigin}/api/users/${user._id}/verify/${user.verificationCode}`;
        yield sendEmail({
            from: senderMailId,
            to: user.email,
            subject: "Verify Your Email Address - Complete Your Registration",
            html: (0, emails_1.verificationEmailTemplate)(verificationUrl),
        });
    });
}
function sendPasswordResetMail(user, passwordResetCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const frontendOrigin = config_1.default.get("clientOrigin");
        const resetUrl = `${frontendOrigin}/auth/resetPassword/${user._id}/${passwordResetCode}`;
        yield sendEmail({
            from: senderMailId,
            to: user.email,
            subject: "Reset Your Password - Secure Your Account",
            html: (0, emails_1.passwordResetEmailTemplate)(resetUrl),
        });
    });
}
