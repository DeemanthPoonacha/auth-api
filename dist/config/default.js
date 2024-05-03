"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: 8080,
    dbUri: "",
    logLevel: "info",
    senderMailId: "admin@auth.com",
    accessTokenTtl: "15m",
    refreshTokenTtl: "1y",
    accessTokenPrivateKey: "",
    refreshTokenPrivateKey: "",
    cookieConfig: {
        httpOnly: true,
        domain: "auth-api-kmqg.onrender.com",
        path: "/",
        sameSite: "none",
        secure: true,
    },
};
