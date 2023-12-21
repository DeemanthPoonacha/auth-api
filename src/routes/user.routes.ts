import express from "express";
import validateResource from "../middlewares/validateResource";
import { createUserSchema, verifyUserSchema } from "../scemas/user.schema";
import {
    createUserHandler,
    verifyUserHandler,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserHandler
);

userRouter.post(
    "/api/users/:id/verify/:verificationCode",
    validateResource(verifyUserSchema),
    verifyUserHandler
);

export default userRouter;
