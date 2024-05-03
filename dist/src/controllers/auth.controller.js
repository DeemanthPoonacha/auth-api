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
exports.invalidateSessionHandler = exports.refreshAccessTokenHandler = exports.createSessionHandler = void 0;
const user_service_1 = require("../setvices/user.service");
const auth_service_1 = require("../setvices/auth.service");
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("../utils/logger"));
const user_model_1 = require("../models/user.model");
function createSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const message = "Invalid credentials!";
        const user = yield (0, user_service_1.findUserByEmail)(email);
        if (!user) {
            logger_1.default.info("User not found");
            return res.status(400).send(message);
        }
        if (!user.verified) {
            logger_1.default.info("User not verified");
            return res
                .status(202)
                .send({ path: `email-verification-pending/${user._id}` });
        }
        const isValid = yield user.validatePassword(password);
        if (!isValid) {
            logger_1.default.info("Invalid password");
            return res.status(400).send(message);
        }
        const accessToken = (0, auth_service_1.signAccessToken)(user);
        const refreshToken = yield (0, auth_service_1.signRefreshToken)({ userId: String(user._id) });
        const refreshMaxAge = 365 * 24 * 60 * 60 * 1000; //1 Year
        const accessMaxAge = 15 * 60 * 1000; //15 minutes
        res.cookie("accessToken", accessToken, {
            maxAge: accessMaxAge,
            httpOnly: true,
            domain: "auth-frontend-cyan.vercel.app",
            path: "/",
            sameSite: "none",
            secure: true,
        });
        res.cookie("refreshToken", refreshToken, {
            maxAge: refreshMaxAge,
            httpOnly: true,
            domain: "auth-frontend-cyan.vercel.app",
            path: "/",
            sameSite: "none",
            secure: true,
        });
        const userPayload = (0, lodash_1.omit)(user.toJSON(), user_model_1.privateUserFields);
        return res.send(Object.assign({ accessToken, refreshToken }, userPayload));
    });
}
exports.createSessionHandler = createSessionHandler;
function refreshAccessTokenHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = (0, lodash_1.get)(req, "cookie.refreshToken") ||
            (0, lodash_1.get)(req, "headers.x-refresh");
        const accessToken = yield (0, auth_service_1.reIssueAccessToken)({ refreshToken });
        if (!accessToken) {
            const message = "could not refresh access token";
            return res.status(400).send(message);
        }
        return res.send({ accessToken });
    });
}
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
function invalidateSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = (0, lodash_1.get)(res.locals.user, "_id");
        if (!userId)
            return res.send("User not logged in");
        const invalidatedCount = yield (0, auth_service_1.invalidateUserSessions)({ userId });
        logger_1.default.info(`${invalidatedCount} sessions Invalidated`);
        if (!invalidatedCount)
            return res.send("No sessions found!");
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.send({ accessToken: null, refreshToken: null });
    });
}
exports.invalidateSessionHandler = invalidateSessionHandler;
