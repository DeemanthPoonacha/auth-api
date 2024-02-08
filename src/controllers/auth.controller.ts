import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/auth.schema";
import { findUserByEmail } from "../setvices/user.service";
import {
    invalidateUserSessions,
    reIssueAccessToken,
    signAccessToken,
    signRefreshToken,
} from "../setvices/auth.service";
import { get, omit } from "lodash";
import log from "../utils/logger";
import { privateUserFields } from "../models/user.model";
import config from "config";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const { email, password } = req.body;
    const message = "Invalid credentials!";

    const user = await findUserByEmail(email);
    if (!user) {
        log.info("User not found");
        return res.status(400).send(message);
    }
    if (!user.verified) {
        log.info("User not verified");
        return res
            .status(202)
            .send({ path: `email-verification-pending/${user._id}` });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
        log.info("Invalid password");
        return res.status(400).send(message);
    }
    const accessToken = signAccessToken(user);

    const refreshToken = await signRefreshToken({ userId: String(user._id) });

    const refreshMaxAge = 365 * 24 * 60 * 60 * 1000; //1 Year
    const accessMaxAge = 15 * 60 * 1000; //15 minutes

    res.cookie("accessToken", accessToken, {
        maxAge: accessMaxAge,
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: refreshMaxAge,
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
    });
    const userPayload = omit(user.toJSON(), privateUserFields);
    return res.send({ accessToken, refreshToken, ...userPayload });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken =
        get(req, "cookie.refreshToken") ||
        (get(req, "headers.x-refresh") as string);
    const accessToken = await reIssueAccessToken({ refreshToken });
    if (!accessToken) {
        const message = "could not refresh access token";
        return res.status(400).send(message);
    }
    return res.send({ accessToken });
}

export async function invalidateSessionHandler(req: Request, res: Response) {
    const userId = get(res.locals.user, "_id");
    if (!userId) return res.send("User not logged in");

    const invalidatedCount = await invalidateUserSessions({ userId });
    log.info(`${invalidatedCount} sessions Invalidated`);
    if (!invalidatedCount) return res.send("No sessions found!");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.send({ accessToken: null, refreshToken: null });
}
