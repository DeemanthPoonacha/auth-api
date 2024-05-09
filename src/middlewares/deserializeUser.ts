import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/auth.service";

export default async function deserializeUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("🚀 ~ req.headers:", req.headers);

    const accessToken =
        get(req, "cookies.accessToken") ||
        get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    console.log("🚀 ~ accessToken:", accessToken);
    if (accessToken) {
        const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

        if (decoded) {
            res.locals.user = decoded;
            return next();
        }
    }

    const refreshToken =
        get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

    if (refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });

        if (newAccessToken) {
            res.cookie("accessToken", newAccessToken, {
                maxAge: 15 * 60 * 1000, //15 minutes
                httpOnly: true,
                domain: "localhost",
                path: "/",
                sameSite: "strict",
                secure: false,
            });
            const decoded = verifyJwt(
                newAccessToken as string,
                "accessTokenPublicKey"
            );

            res.locals.user = decoded;
            return next();
        }
    }
    return next();
}
