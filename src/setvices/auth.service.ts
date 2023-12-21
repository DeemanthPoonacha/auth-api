import { DocumentType } from "@typegoose/typegoose";
import { User } from "../models/user.model";
import { signJwt } from "../utils/jwtUtils";
import SessionModel from "../models/session.model";

export function createSession({ userId }: { userId: any }) {
    return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: any }) {
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        { session: session._id },
        "refreshTokenPrivateKey"
    );
    return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
    const payload = user.toJSON();

    const accessToken = signJwt(payload, "accessTokenPrivateKey");
    return accessToken;
}
