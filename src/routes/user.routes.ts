import express from "express";
import validateResource from "../middlewares/validateResource";
import {
    createUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyUserSchema,
} from "../scemas/user.schema";
import {
    createUserHandler,
    forgotPasswordHandler,
    getCurrentUserHandler,
    resetPasswordHandler,
    verifyUserHandler,
} from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser";
const USER_ROUTE = "/api/users";
const userRouter = express.Router();

userRouter.get(`${USER_ROUTE}/me`, requireUser, getCurrentUserHandler);

userRouter.post(
    `${USER_ROUTE}`,
    validateResource(createUserSchema),
    createUserHandler
);

userRouter.post(
    `${USER_ROUTE}/:id/verify/:verificationCode`,
    validateResource(verifyUserSchema),
    verifyUserHandler
);

userRouter.post(
    `${USER_ROUTE}/forgot-password`,
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
);

userRouter.post(
    `${USER_ROUTE}/:id/reset-password/:passwordResetCode`,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

export default userRouter;
