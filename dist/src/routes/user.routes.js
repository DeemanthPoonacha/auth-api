"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const user_schema_1 = require("../schemas/user.schema");
const user_controller_1 = require("../controllers/user.controller");
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const apiPaths_1 = require("../constants/apiPaths");
const userRouter = express_1.default.Router();
// current user info
userRouter.get(apiPaths_1.CURRENT_USER_API_PATH, requireUser_1.default, user_controller_1.getCurrentUserHandler);
// Create a new user
userRouter.post(apiPaths_1.USERS_API_PATH, (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
// update user
userRouter.patch(apiPaths_1.USERS_API_PATH, requireUser_1.default, (0, validateResource_1.default)(user_schema_1.updateUserSchema), user_controller_1.updateUserHandler);
// Resend verification email
userRouter.post(apiPaths_1.RESEND_VERIFICATION_API_PATH, (0, validateResource_1.default)(user_schema_1.resendVerificationSchema), user_controller_1.resendVerificationHandler);
// verify user
userRouter.get(apiPaths_1.VERIFY_USER_API_PATH, (0, validateResource_1.default)(user_schema_1.verifyUserSchema), user_controller_1.verifyUserHandler);
// Request reset password
userRouter.post(apiPaths_1.FORGOT_PASSWORD_API_PATH, (0, validateResource_1.default)(user_schema_1.forgotPasswordSchema), user_controller_1.forgotPasswordHandler);
// Reset password
userRouter.post(apiPaths_1.RESET_PASSWORD_API_PATH, (0, validateResource_1.default)(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler);
// Delete user
userRouter.delete(apiPaths_1.USERS_API_PATH, requireUser_1.default, user_controller_1.deleteUserHandler);
exports.default = userRouter;
