import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/auth.service";
import config from "config";
import { CookieOptions } from "express";

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Mobile - Cookies received:", req.cookies.accessToken);
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (accessToken) {
    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      console.log("Mobile - Decoded:", decoded);
      res.locals.user = decoded;
      return next();
    }
  }

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      const cookieConfig = config.get<CookieOptions>("cookieConfig");
      const accessMaxAge = 15 * 60 * 1000; //15 minutes

      res.cookie("accessToken", newAccessToken, {
        maxAge: accessMaxAge,
        ...cookieConfig,
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
