import express from "express";
import validateResource from "../middlewares/validateResource";
import {
    changePasswordSchema,
    createUserSchema,
    forgotPasswordSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    updateUserSchema,
    verifyUserSchema,
} from "../schemas/user.schema";
import {
    changePasswordHandler,
    createUserHandler,
    deleteUserHandler,
    forgotPasswordHandler,
    getCurrentUserHandler,
    resendVerificationHandler,
    resetPasswordHandler,
    updateUserHandler,
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
    CHANGE_PASSWORD_API_PATH,
} from "../constants/apiPaths";

const userRouter = express.Router();

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
userRouter.get(CURRENT_USER_API_PATH, requireUser, getCurrentUserHandler);

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
userRouter.post(
    USERS_API_PATH,
    validateResource(createUserSchema),
    createUserHandler
);

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
userRouter.patch(
    USERS_API_PATH,
    requireUser,
    validateResource(updateUserSchema),
    updateUserHandler
);

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
userRouter.post(
    RESEND_VERIFICATION_API_PATH,
    validateResource(resendVerificationSchema),
    resendVerificationHandler
);

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
userRouter.get(
    VERIFY_USER_API_PATH,
    validateResource(verifyUserSchema),
    verifyUserHandler
);

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
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
userRouter.post(
    FORGOT_PASSWORD_API_PATH,
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
);

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
userRouter.post(
    RESET_PASSWORD_API_PATH,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

// Change password
/**
 * @openapi
 * '/api/users/change-password':
 *   patch:
 *     tags:
 *       - User
 *     summary: Change user password
 *     description: Change the password of the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ChangePasswordResponse'
 *       400:
 *         description: Bad request or user not found in the database
 *       401:
 *         description: Unauthorized - user not logged in
 */
userRouter.patch(
    CHANGE_PASSWORD_API_PATH,
    requireUser,
    validateResource(changePasswordSchema),
    changePasswordHandler
);

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
userRouter.delete(USERS_API_PATH, requireUser, deleteUserHandler);

export default userRouter;
