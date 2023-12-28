import { DocumentType } from "@typegoose/typegoose";
import { User, privateUserFields } from "../models/user.model";
import { signJwt } from "../utils/jwtUtils";
import SessionModel from "../models/session.model";
import { omit } from "lodash";
import config from "config";

export function createSession({ userId }: { userId: any }) {
    return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: any }) {
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        { session: session._id },
        "refreshTokenPrivateKey",
        {
            expiresIn: config.get("refreshTokenTtl"),
        }
    );
    return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateUserFields);

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
        expiresIn: config.get("accessTokenTtl"),
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
