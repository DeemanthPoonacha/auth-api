import express from "express";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../scemas/auth.schema";
import {
    createSessionHandler,
    refreshAccessTokenHandler,
} from "../controllers/auth.controller";
const AUTH_ROUTE = "/api/sessions";
const authRouter = express.Router();

authRouter.post(
    AUTH_ROUTE,
    validateResource(createSessionSchema),
    createSessionHandler
);

authRouter.post(`${AUTH_ROUTE}/refresh`, refreshAccessTokenHandler);

export default authRouter;
