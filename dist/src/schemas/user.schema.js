"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyUserSchema = exports.resendVerificationSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
/**
 * @openapi
 * components:
 *
 *  schemas:
 *
 *     CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - fullName
 *        - password
 *        - passwordConfirm
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          default: jane.doe@example.com
 *        fullName:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirm:
 *          type: string
 *          default: stringPassword123
 *
 *     CreateUserResponse:
 *      type: string
 *      default: User created successfully!
 */
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        fullName: (0, zod_1.string)({
            required_error: "Full name is required!",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required!",
        }).min(6, "Password must be at least 6 characters"),
        passwordConfirm: (0, zod_1.string)({
            required_error: "Password confirmation is required!",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
        image: (0, zod_1.string)().optional(),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *           default: Jane Doe
 *         email:
 *           type: string
 *           default: jane.doe@example.com
 *           format: email
 *           description: The email address of the user
 *         image:
 *           type: string
 *           description: The URL of the user's image
 *
 *     UpdateUserResponse:
 *       type: string
 *       description: A message indicating the success of the user update operation.
 *       example: User updated successfully!
 */
exports.updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        fullName: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)().email("Invalid email address!").optional(),
        image: (0, zod_1.string)().optional(),
    }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *     ResendVerificationResponse:
 *       type: string
 *       description: A message indicating the result of the resend verification email operation.
 *       example: Verification mail will be sent to the Email address if registered.
 */
exports.resendVerificationSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "id is missing!",
        }),
    }),
});
exports.verifyUserSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "id is missing!",
        }),
        verificationCode: (0, zod_1.string)({
            required_error: "verification code is missing!",
        }),
    }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user requesting password reset.
 *           example: jane.doe@example.com
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         path:
 *           type: string
 *           description: The path to the password reset email.
 *         message:
 *           type: string
 *           description: Information message about the action taken.
 */
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
    }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordInput:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           example: new-password
 *           description: The new password for the user.
 *           minLength: 6
 *         passwordConfirm:
 *           type: string
 *           example: new-password
 *           description: The confirmation of the new password.
 *       required:
 *         - id
 *         - passwordResetCode
 *         - password
 *         - passwordConfirm
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         path:
 *           type: string
 *           description: The path to redirect after successful password reset.
 *         message:
 *           type: string
 *           description: A message indicating the success of the password reset operation.
 *           example: Password reset successfully!
 */
exports.resetPasswordSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "id is missing!",
        }),
        passwordResetCode: (0, zod_1.string)({
            required_error: "Password reset code is missing!",
        }),
    }),
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: "Password is required!",
        }).min(6, "Password must be at least 6 characters"),
        passwordConfirm: (0, zod_1.string)({
            required_error: "Password confirmation is required!",
        }),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - newPasswordConfirm
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: The user's current password.
 *           example: password
 *         newPassword:
 *           type: string
 *           description: The new password for the user's account.
 *           example: new-password
 *         newPasswordConfirm:
 *           type: string
 *           description: Confirmation of the new password.
 *           example: new-password
 *     ChangePasswordResponse:
 *       type: string
 *       description: A message indicating the success of the password change operation.
 *       example: Password changed successfully!
 */
exports.changePasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        currentPassword: (0, zod_1.string)().min(6, "Password must be at least 6 characters"),
        newPassword: (0, zod_1.string)().min(6, "Password must be at least 6 characters"),
        newPasswordConfirm: (0, zod_1.string)().min(1, "Password confirmation is required!"),
    }).refine((data) => data.newPassword === data.newPasswordConfirm, {
        message: "Passwords do not match",
        path: ["newPasswordConfirm"],
    }),
});
