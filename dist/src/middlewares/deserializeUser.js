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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deserializeUser;
const jwtUtils_1 = require("../utils/jwtUtils");
const lodash_1 = require("lodash");
const auth_service_1 = require("../services/auth.service");
function deserializeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Mobile - Cookies received:", req.cookies.accessToken);
        const accessToken = (0, lodash_1.get)(req, "cookies.accessToken") ||
            (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
        if (accessToken) {
            const decoded = (0, jwtUtils_1.verifyJwt)(accessToken, "accessTokenPublicKey");
            if (decoded) {
                console.log("Mobile - Decoded:", decoded);
                res.locals.user = decoded;
                return next();
            }
        }
        const refreshToken = (0, lodash_1.get)(req, "cookies.refreshToken") || (0, lodash_1.get)(req, "headers.x-refresh");
        if (refreshToken) {
            const newAccessToken = yield (0, auth_service_1.reIssueAccessToken)({ refreshToken });
            if (newAccessToken) {
                res.cookie("accessToken", newAccessToken, {
                    maxAge: 15 * 60 * 1000, //15 minutes
                    httpOnly: true,
                    domain: "localhost",
                    path: "/",
                    sameSite: "strict",
                    secure: false,
                });
                const decoded = (0, jwtUtils_1.verifyJwt)(newAccessToken, "accessTokenPublicKey");
                res.locals.user = decoded;
                return next();
            }
        }
        return next();
    });
}
