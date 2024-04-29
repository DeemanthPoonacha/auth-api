import { DocumentType } from "@typegoose/typegoose";
import { User, privateUserFields } from "../models/user.model";
import { signJwt, verifyJwt } from "../utils/jwtUtils";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import config from "config";
import log from "../utils/logger";
import { findUserById } from "./user.service";

export function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        { session: session._id },
        "refreshTokenPrivateKey",
        {
            expiresIn: config.get("refreshTokenTtl") || "1y",
        }
    );
    return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), [...privateUserFields, "image"]);

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
        expiresIn: config.get("accessTokenTtl") || "15m",
    });
    return accessToken;
}

export async function findSessionById(id: string) {
    return SessionModel.findById(id);
}

export async function findSessionsByUser({ userId }: { userId: string }) {
    return SessionModel.find({ user: userId });
}

export async function invalidateUserSessions({ userId }: { userId: string }) {
    const result = await SessionModel.updateMany(
        { user: userId, valid: true },
        { $set: { valid: false } }
    );
    return result.modifiedCount;
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    const decoded = verifyJwt<{ session: string }>(
        refreshToken,
        "refreshTokenPublicKey"
    );

    if (!decoded) {
        log.info("Unable to decode refresh token");
        return false;
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
        log.info("Session not found or invalid");
        return false;
    }

    const user = await findUserById(String(session.user));
    if (!user) {
        log.info("User not found");
        return false;
    }
    const accessToken = signAccessToken(user);
    log.info("Reissuing access token");

    return accessToken;
}
