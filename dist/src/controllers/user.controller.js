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
exports.deleteUserHandler = exports.updateUserHandler = exports.getCurrentUserHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.verifyUserHandler = exports.resendVerificationHandler = exports.createUserHandler = void 0;
const user_service_1 = require("../setvices/user.service");
const auth_service_1 = require("../setvices/auth.service");
const logger_1 = __importDefault(require("../utils/logger"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("config"));
const mailer_1 = require("../utils/mailer");
const mailer_2 = require("../utils/mailer");
const lodash_1 = require("lodash");
const user_model_1 = require("../models/user.model");
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
exports.createUserHandler = createUserHandler;
function resendVerificationHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield (0, user_service_1.findUserById)(id);
            if (!user)
                return res.send("User not found!");
            const frontendOrigin = config_1.default.get("clientOrigin");
            if (user.verified)
                return res.send(`
        <div>
            <p>User already verified!</p>
            <p>To login to your account, <a href="${frontendOrigin}/auth/login">Click Here</a>.</p>
        </div>`);
            yield (0, mailer_1.sendVerificationMail)(user);
            return res.send("Verification mail will be sent to the Email address if registered.");
        }
        catch (error) {
            return res.status(500).send(error);
        }
    });
}
exports.resendVerificationHandler = resendVerificationHandler;
function verifyUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, verificationCode } = req.params;
        try {
            const user = yield (0, user_service_1.findUserById)(id);
            if (!user)
                return res.send("User not found!");
            const frontendOrigin = config_1.default.get("clientOrigin");
            if (user.verified)
                return res.send(`
        <div>
            <p>User already verified!</p>
            <p>To login to your account, <a href="${frontendOrigin}/auth/login">Click Here</a>.</p>
        </div>`);
            if (verificationCode !== user.verificationCode) {
                return res.send("Invalid verification code");
            }
            user.verified = true;
            yield user.save();
            return res.send(`
        <div>
            <p>User verified successfully!</p>
            <p>To login to your account, <a href="${frontendOrigin}/auth/login">Click Here</a>.</p>
        </div>`);
        }
        catch (error) {
            return res.status(500).send(error);
        }
    });
}
exports.verifyUserHandler = verifyUserHandler;
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
exports.forgotPasswordHandler = forgotPasswordHandler;
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
exports.resetPasswordHandler = resetPasswordHandler;
function getCurrentUserHandler(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_service_1.findUserById)((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a._id);
        const payload = (0, lodash_1.omit)(user === null || user === void 0 ? void 0 : user.toJSON(), user_model_1.privateUserFields);
        return res.send(payload);
    });
}
exports.getCurrentUserHandler = getCurrentUserHandler;
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
exports.updateUserHandler = updateUserHandler;
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
        return res.send("User deleted successfully!");
    });
}
exports.deleteUserHandler = deleteUserHandler;
