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
    deleteUserHandler,
    forgotPasswordHandler,
    getCurrentUserHandler,
    resetPasswordHandler,
    verifyUserHandler,
} from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser";
const USER_ROUTE = "/api/users";
const userRouter = express.Router();

// current user info
userRouter.get(`${USER_ROUTE}/me`, requireUser, getCurrentUserHandler);

// Create a new user
userRouter.post(
    `${USER_ROUTE}`,
    validateResource(createUserSchema),
    createUserHandler
);

// verify user
userRouter.post(
    `${USER_ROUTE}/:id/verify/:verificationCode`,
    validateResource(verifyUserSchema),
    verifyUserHandler
);

// Request reset password
userRouter.post(
    `${USER_ROUTE}/forgot-password`,
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
);

// Reset password
userRouter.post(
    `${USER_ROUTE}/:id/reset-password/:passwordResetCode`,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

// Delete user
userRouter.delete(`${USER_ROUTE}`, requireUser, deleteUserHandler);

export default userRouter;
