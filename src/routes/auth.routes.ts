import express from "express";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../scemas/auth.schema";
import {
    createSessionHandler,
    invalidateSessionHandler,
    refreshAccessTokenHandler,
} from "../controllers/auth.controller";
import requireUser from "../middlewares/requireUser";
const AUTH_ROUTE = "/api/sessions";
const authRouter = express.Router();

authRouter.post(
    AUTH_ROUTE,
    validateResource(createSessionSchema),
    createSessionHandler
);

authRouter.delete(AUTH_ROUTE, requireUser, invalidateSessionHandler);

authRouter.post(`${AUTH_ROUTE}/refresh`, refreshAccessTokenHandler);

export default authRouter;
