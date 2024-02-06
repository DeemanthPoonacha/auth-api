import express from "express";
import validateResource from "../middlewares/validateResource";
import {
    createUserSchema,
    forgotPasswordSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    verifyUserSchema,
} from "../schemas/user.schema";
import {
    createUserHandler,
    deleteUserHandler,
    forgotPasswordHandler,
    getCurrentUserHandler,
    resendVerificationHandler,
    resetPasswordHandler,
    verifyUserHandler,
} from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser";
import {
    CURRENT_USER_API_PATH,
    USERS_API_PATH,
    VERIFY_USER_API_PATH,
    FORGOT_PASSWORD_API_PATH,
    RESET_PASSWORD_API_PATH,
    RESEND_VERIFICATION_API_PATH,
} from "../constants/apiPaths";

const userRouter = express.Router();

// current user info
userRouter.get(CURRENT_USER_API_PATH, requireUser, getCurrentUserHandler);

// Create a new user
userRouter.post(
    USERS_API_PATH,
    validateResource(createUserSchema),
    createUserHandler
);

// Resend verification email
userRouter.post(
    RESEND_VERIFICATION_API_PATH,
    validateResource(resendVerificationSchema),
    resendVerificationHandler
);

// verify user
userRouter.get(
    VERIFY_USER_API_PATH,
    validateResource(verifyUserSchema),
    verifyUserHandler
);

// Request reset password
userRouter.post(
    FORGOT_PASSWORD_API_PATH,
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
);

// Reset password
userRouter.post(
    RESET_PASSWORD_API_PATH,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

// Delete user
userRouter.delete(USERS_API_PATH, requireUser, deleteUserHandler);

export default userRouter;
