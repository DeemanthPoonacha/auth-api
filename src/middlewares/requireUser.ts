import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";

export default async function requireUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = res.locals.user;
    if (!user) return res.sendStatus(403);
    log.info("User logged in");

    return next();
}
