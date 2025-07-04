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
exports.createUserHandler = createUserHandler;
exports.resendVerificationHandler = resendVerificationHandler;
exports.verifyUserHandler = verifyUserHandler;
exports.forgotPasswordHandler = forgotPasswordHandler;
exports.resetPasswordHandler = resetPasswordHandler;
exports.changePasswordHandler = changePasswordHandler;
exports.getCurrentUserHandler = getCurrentUserHandler;
exports.updateUserHandler = updateUserHandler;
exports.deleteUserHandler = deleteUserHandler;
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
const logger_1 = __importDefault(require("../utils/logger"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("config"));
const mailer_1 = require("../utils/mailer");
const mailer_2 = require("../utils/mailer");
const lodash_1 = require("lodash");
const user_model_1 = require("../models/user.model");
const emails_1 = require("../templates/emails");
const frontendOrigin = config_1.default.get("clientOrigin");
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        try {
            const user = yield (0, user_service_1.createUser)(body);
            yield (0, mailer_1.sendVerificationMail)(user);
            return res.send("User created successfully!");
        }
        catch (error) {
            if (error.code === 11000) {
                return res
                    .status(409)
                    .send(`Account with email (${body.email}) already exists.`);
            }
            return res.status(500).send(error);
        }
    });
}
function resendVerificationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield (0, user_service_1.findUserById)(id);
            if (!user)
                return res.send("User not found!");
            const frontendOrigin = config_1.default.get("clientOrigin");
            if (user.verified)
                return res.send((0, emails_1.alreadyVerifiedTemplate)(`${frontendOrigin}/auth/login`));
            yield (0, mailer_1.sendVerificationMail)(user);
            return res.send("Verification mail will be sent to the Email address if registered.");
        }
        catch (error) {
            return res.status(500).send(error);
        }
    });
}
function verifyUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, verificationCode } = req.params;
        try {
            const user = yield (0, user_service_1.findUserById)(id);
            if (!user)
                return res.status(404).send("User not found!");
            const frontendOrigin = config_1.default.get("clientOrigin");
            if (user.verified)
                return res
                    .status(409)
                    .send((0, emails_1.alreadyVerifiedTemplate)(`${frontendOrigin}/auth/login`));
            if (verificationCode !== user.verificationCode) {
                return res.status(400).send("Invalid verification code");
            }
            user.verified = true;
            yield user.save();
            return res.send((0, emails_1.verificationSuccessTemplate)(`${frontendOrigin}/auth/login`));
        }
        catch (error) {
            return res.status(500).send(error);
        }
    });
}
function forgotPasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        const user = yield (0, user_service_1.findUserByEmail)(email);
        const message = `A password reset email will be sent to the ${email} if user is registered.`;
        if (!user) {
            logger_1.default.info(`User with email:${email} not found in DB`);
            return res.status(202).send({ path: `password-reset-mail`, message });
        }
        if (!user.verified) {
            logger_1.default.info("User not verified!");
            return res
                .status(202)
                .send({ path: `email-verification-pending/${user._id}` });
        }
        const passwordResetCode = (0, uuid_1.v4)();
        user.passwordResetCode = passwordResetCode;
        yield user.save();
        yield (0, mailer_2.sendPasswordResetMail)(user, passwordResetCode);
        return res.status(202).send({ path: `password-reset-mail`, message });
    });
}
function resetPasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, passwordResetCode } = req.params;
            const { password } = req.body;
            const user = yield (0, user_service_1.findUserById)(id);
            if (!user ||
                !user.passwordResetCode ||
                user.passwordResetCode !== passwordResetCode) {
                if (!user)
                    logger_1.default.info("User not found");
                if (!(user === null || user === void 0 ? void 0 : user.passwordResetCode))
                    logger_1.default.info("No password reset code found");
                if ((user === null || user === void 0 ? void 0 : user.passwordResetCode) !== passwordResetCode)
                    logger_1.default.info("Password reset code mismatch");
                return res.status(400).send("Couldn't reset password!");
            }
            user.password = password;
            user.passwordResetCode = null;
            yield user.save();
            logger_1.default.info("Password reset successfully!");
            return res.status(202).send({
                path: `password-reset-success`,
                message: "Password reset successfully!",
            });
        }
        catch (error) {
            logger_1.default.error(error);
            return res.status(400).send("Couldn't reset password!");
        }
    });
}
function changePasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = "Couldn't change password!";
        try {
            const { currentPassword, newPassword } = req.body;
            const currentUser = res.locals.user;
            const { email } = currentUser;
            const user = yield (0, user_service_1.findUserByEmail)(email);
            if (!user) {
                logger_1.default.info("User not found");
                return res.status(401).send(message);
            }
            const isValid = yield user.validatePassword(currentPassword);
            if (!isValid) {
                logger_1.default.info("Invalid password");
                return res.status(401).send("Invalid current password");
            }
            user.password = newPassword;
            yield user.save();
            logger_1.default.info("Password changed successfully!");
            return res.send("Password changed successfully!");
        }
        catch (error) {
            logger_1.default.error(error);
            return res.status(401).send(message);
        }
    });
}
function getCurrentUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = yield (0, user_service_1.findUserById)((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a._id);
        const payload = (0, lodash_1.omit)(user === null || user === void 0 ? void 0 : user.toJSON(), user_model_1.privateUserFields);
        return res.send(payload);
    });
}
function updateUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const message = "Couldn't update user";
        if ((0, lodash_1.isEmpty)(body))
            return res.status(422).send(message);
        const user = res.locals.user;
        if (!user) {
            logger_1.default.info("User not logged in");
            return res.status(401).send(message);
        }
        const result = yield (0, user_service_1.findAndUpdateUserById)(String(user._id), body);
        if (!result) {
            logger_1.default.info("User not found in DB");
            return res.status(400).send(message);
        }
        return res.send("User updated successfully!");
    });
}
function deleteUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = "Couldn't delete user";
        const user = res.locals.user;
        if (!user) {
            logger_1.default.info("User not logged in");
            return res.status(400).send(message);
        }
        const result = yield (0, user_service_1.deleteUserById)(String(user._id));
        if (!result.deletedCount) {
            logger_1.default.info("User not found in DB");
            return res.status(400).send(message);
        }
        yield (0, auth_service_1.invalidateUserSessions)({ userId: String(user._id) });
        const cookieConfig = config_1.default.get("cookieConfig");
        res.clearCookie("accessToken", cookieConfig);
        res.clearCookie("refreshToken", cookieConfig);
        return res.send({
            accessToken: null,
            refreshToken: null,
            message: "User deleted successfully!",
        });
    });
}
