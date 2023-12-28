import { Request, Response } from "express";
import { CreateSessionInput } from "../scemas/auth.schema";
import { findUserByEmail, findUserById } from "../setvices/user.service";
import {
    findSessionById,
    findSessionByUser,
    signAccessToken,
    signRefreshToken,
} from "../setvices/auth.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwtUtils";
import log from "../utils/logger";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const { email, password } = req.body;
    const message = "Invalid credentials!";

    const user = await findUserByEmail(email);
    if (!user) {
        log.info("User not found");
        return res.send(message);
    }
    if (!user.verified) {
        log.info("User not verified");
        return res.send("Please verify your email.");
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
        log.info("Invalid password");
        return res.send(message);
    }
    const accessToken = signAccessToken(user);

    const refreshToken = await signRefreshToken({ userId: user._id });

    return res.send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken = get(req, "headers.x-refresh") as string;
    const decoded = verifyJwt<{ session: string }>(
        refreshToken,
        "refreshTokenPublicKey"
    );

    const message = "could not refresh access token";
    if (!decoded) {
        log.info("Unable to decode refresh token");
        return res.status(400).send(message);
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
        log.info("Session not found or invalid");
        return res.status(400).send(message);
    }
    console.log(String(session.user));

    const user = await findUserById(String(session.user));
    if (!user) {
        log.info("User not found");
        return res.status(400).send(message);
    }
    const accessToken = signAccessToken(user);
    return res.send({ accessToken });
}

export async function invalidateSessionHandler(req: Request, res: Response) {
    const userId = get(res.locals.user, "_id");
    if (!userId) return res.send("User not logged in");

    const sessions = await findSessionByUser({ userId });
    if (!sessions.length) return res.send("No session found!");
    sessions.forEach(async (session) => {
        session.valid = false;
        await session.save();
    });

    return res.send({ accessToken: null, refreshToken: null });
}
