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
exports.createSession = createSession;
exports.signRefreshToken = signRefreshToken;
exports.signAccessToken = signAccessToken;
exports.findSessionById = findSessionById;
exports.findSessionsByUser = findSessionsByUser;
exports.invalidateUserSessions = invalidateUserSessions;
exports.reIssueAccessToken = reIssueAccessToken;
const user_model_1 = require("../models/user.model");
const jwtUtils_1 = require("../utils/jwtUtils");
const session_model_1 = __importDefault(require("../models/session.model"));
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../utils/logger"));
const user_service_1 = require("./user.service");
function createSession({ userId }) {
    return session_model_1.default.create({ user: userId });
}
function signRefreshToken(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        const session = yield createSession({ userId });
        const refreshToken = (0, jwtUtils_1.signJwt)({ session: session._id }, "refreshTokenPrivateKey", {
            expiresIn: config_1.default.get("refreshTokenTtl"),
        });
        return refreshToken;
    });
}
function signAccessToken(user) {
    const payload = (0, lodash_1.omit)(user.toJSON(), [...user_model_1.privateUserFields, "image"]);
    const accessToken = (0, jwtUtils_1.signJwt)(payload, "accessTokenPrivateKey", {
        expiresIn: config_1.default.get("accessTokenTtl"),
    });
    return accessToken;
}
function findSessionById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_model_1.default.findById(id);
    });
}
function findSessionsByUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        return session_model_1.default.find({ user: userId });
    });
}
function invalidateUserSessions(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        const result = yield session_model_1.default.updateMany({ user: userId, valid: true }, { $set: { valid: false } });
        return result.modifiedCount;
    });
}
function reIssueAccessToken(_a) {
    return __awaiter(this, arguments, void 0, function* ({ refreshToken, }) {
        const decoded = (0, jwtUtils_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
        if (!decoded) {
            logger_1.default.info("Unable to decode refresh token");
            return false;
        }
        const session = yield findSessionById(decoded.session);
        if (!session || !session.valid) {
            logger_1.default.info("Session not found or invalid");
            return false;
        }
        const user = yield (0, user_service_1.findUserById)(String(session.user));
        if (!user) {
            logger_1.default.info("User not found");
            return false;
        }
        const accessToken = signAccessToken(user);
        logger_1.default.info("Reissuing access token");
        return accessToken;
    });
}
