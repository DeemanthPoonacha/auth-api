"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
function signJwt(object, keyName, options) {
    const signingKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    return jsonwebtoken_1.default.sign(object, signingKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
}
function verifyJwt(token, keyName) {
    const publicKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        logger_1.default.info(`${keyName.replace("PublicKey", "")} valid`);
        return decoded;
    }
    catch (error) {
        logger_1.default.error(`${keyName.replace("PublicKey", "")} invalid`);
        return null;
    }
}
