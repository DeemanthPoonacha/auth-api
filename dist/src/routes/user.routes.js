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
/**
 * @openapi
 * '/api/users/me':
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user information
 *     description: Retrieve information about the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 fullName:
 *                   type: string
 *                   description: The full name of the user.
 *                 image:
 *                   type: string
 *                   description: User Image.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time when the user was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time when the user was last updated.
 *
 *       401:
 *         description: Unauthorized - user not logged in
 *       403:
 *         description: Forbidden - user not authorized
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
userRouter.get(apiPaths_1.CURRENT_USER_API_PATH, requireUser_1.default, user_controller_1.getCurrentUserHandler);
// Create a new user
/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
userRouter.post(apiPaths_1.USERS_API_PATH, (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
// update user
/**
 * @openapi
 * '/api/users':
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user information
 *     description: Update the information of the currently logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Bad request or user not found in the database
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized - user not logged in
 *       422:
 *         description: Unprocessable Entity - request body is empty
 */
userRouter.patch(apiPaths_1.USERS_API_PATH, requireUser_1.default, (0, validateResource_1.default)(user_schema_1.updateUserSchema), user_controller_1.updateUserHandler);
// Resend verification email
/**
 * @openapi
 * '/api/users/{id}/verify':
 *   post:
 *     tags:
 *       - User
 *     summary: Resend verification email
 *     description: Resend the verification email to the user with the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *
 *     responses:
 *       200:
 *         description: Verification email resend successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResendVerificationResponse'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.post(apiPaths_1.RESEND_VERIFICATION_API_PATH, (0, validateResource_1.default)(user_schema_1.resendVerificationSchema), user_controller_1.resendVerificationHandler);
// verify user
/**
 * @openapi
 * '/api/users/{id}/verify/{verificationCode}':
 *   get:
 *     tags:
 *       - User
 *     summary: Verify user
 *     description: Verify a user's account using the provided verification code
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: verificationCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification code
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: >
 *                 <div>
 *                     <p>User verified successfully!</p>
 *                     <p>To login to your account, <a href="{frontendOrigin}/auth/login">Click Here</a>.</p>
 *                 </div>
 *       404:
 *         description: User not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found!
 *       409:
 *         description: User already verified
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: >
 *                 <div>
 *                     <p>User already verified!</p>
 *                     <p>To login to your account, <a href="{frontendOrigin}/auth/login">Click Here</a>.</p>
 *                 </div>
 *       400:
 *         description: Invalid verification code
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid verification code
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
userRouter.get(apiPaths_1.VERIFY_USER_API_PATH, (0, validateResource_1.default)(user_schema_1.verifyUserSchema), user_controller_1.verifyUserHandler);
// Request reset password
/**
 * @openapi
 * '/api/users/forgot-password':
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset
 *     description: Request a password reset by providing the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       202:
 *         description: Accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *                   description: The path to the password reset email.
 *                 message:
 *                   type: string
 *                   description: Information message about the action taken.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
userRouter.post(apiPaths_1.FORGOT_PASSWORD_API_PATH, (0, validateResource_1.default)(user_schema_1.forgotPasswordSchema), user_controller_1.forgotPasswordHandler);
// Reset password
/**
 * @openapi
 * '/api/users/{id}/reset-password/{passwordResetCode}':
 *   post:
 *     tags:
 *       - User
 *     summary: Reset user password
 *     description: Reset the password of a user using the provided reset code.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *       - in: path
 *         name: passwordResetCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset code sent to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       202:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: Bad request or password reset failed
 */
userRouter.post(apiPaths_1.RESET_PASSWORD_API_PATH, (0, validateResource_1.default)(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler);
userRouter.patch(apiPaths_1.CHANGE_PASSWORD_API_PATH, requireUser_1.default, (0, validateResource_1.default)(user_schema_1.changePasswordSchema), user_controller_1.changePasswordHandler);
// Delete user
/**
 * @openapi
 * '/api/users':
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user
 *     description: Delete the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User deleted successfully!
 *       400:
 *         description: Bad request or user not found in the database
 *       401:
 *         description: Unauthorized - user not logged in
 *       403:
 *         description: Forbidden - no token provided
 */
userRouter.delete(apiPaths_1.USERS_API_PATH, requireUser_1.default, user_controller_1.deleteUserHandler);
exports.default = userRouter;
