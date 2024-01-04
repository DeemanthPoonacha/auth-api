import express from "express";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../scemas/auth.schema";
import {
    createSessionHandler,
    invalidateSessionHandler,
    refreshAccessTokenHandler,
} from "../controllers/auth.controller";
import requireUser from "../middlewares/requireUser";
import {
    LOGIN_API_PATH,
    LOGOUT_API_PATH,
    REFRESH_ACCESS_TOKEN_API_PATH,
} from "../constants/apiPaths";

const authRouter = express.Router();

// Login user
authRouter.post(
    LOGIN_API_PATH,
    validateResource(createSessionSchema),
    createSessionHandler
);

// Logout user
authRouter.delete(LOGOUT_API_PATH, requireUser, invalidateSessionHandler);

// refresh access token
authRouter.post(REFRESH_ACCESS_TOKEN_API_PATH, refreshAccessTokenHandler);

export default authRouter;
