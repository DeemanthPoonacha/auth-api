import config from "config";
import jwt from "jsonwebtoken";
import log from "./logger";

export function signJwt(
    object: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
) {
    const signingKey = Buffer.from(
        config.get<string>(keyName),
        "base64"
    ).toString("ascii");
    console.log(keyName, config.get<string>(keyName), signingKey);

    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

export function verifyJwt<T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
    const publicKey = Buffer.from(
        config.get<string>(keyName),
        "base64"
    ).toString("ascii");
    console.log(keyName, config.get<string>(keyName), publicKey);

    console.log("token: " + JSON.stringify(token));

    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (error) {
        log.error("Error verifying token");
        return null;
    }
}
