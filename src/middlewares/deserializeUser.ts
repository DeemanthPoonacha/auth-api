import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import { get } from "lodash";

export default async function deserializeUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const accessToken =
        get(req, "cookies.accessToken") ||
        get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    console.log({
        accessToken,
        cookie: get(req, "cookies.accessToken"),
        auth: get(req, "headers.authorization"),
    });

    if (!accessToken) return next();

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
        res.locals.user = decoded;
    }

    return next();
}
