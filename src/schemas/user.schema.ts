import { TypeOf, object, string } from "zod";

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
export const createUserSchema = object({
    body: object({
        fullName: string({
            required_error: "Full name is required!",
        }),
        password: string({
            required_error: "Password is required!",
        }).min(6, "Password must be at least 6 characters"),
        passwordConfirm: string({
            required_error: "Password confirmation is required!",
        }),
        email: string({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
        image: string().optional(),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
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
export const updateUserSchema = object({
    body: object({
        fullName: string().optional(),
        email: string().email("Invalid email address!").optional(),
        image: string().optional(),
    }),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>["body"];
/**
 * @openapi
 * components:
 *   schemas:
 *     ResendVerificationResponse:
 *       type: string
 *       description: A message indicating the result of the resend verification email operation.
 *       example: Verification mail will be sent to the Email address if registered.
 */

export const resendVerificationSchema = object({
    params: object({
        id: string({
            required_error: "id is missing!",
        }),
    }),
});

export type ResendVerificationInput = TypeOf<
    typeof resendVerificationSchema
>["params"];

export const verifyUserSchema = object({
    params: object({
        id: string({
            required_error: "id is missing!",
        }),
        verificationCode: string({
            required_error: "verification code is missing!",
        }),
    }),
});

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

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
export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
    }),
});

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

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
export const resetPasswordSchema = object({
    params: object({
        id: string({
            required_error: "id is missing!",
        }),
        passwordResetCode: string({
            required_error: "Password reset code is missing!",
        }),
    }),
    body: object({
        password: string({
            required_error: "Password is required!",
        }).min(6, "Password must be at least 6 characters"),
        passwordConfirm: string({
            required_error: "Password confirmation is required!",
        }),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

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
export const changePasswordSchema = object({
    body: object({
        currentPassword: string().min(
            6,
            "Password must be at least 6 characters"
        ),
        newPassword: string().min(6, "Password must be at least 6 characters"),
        newPasswordConfirm: string().min(
            1,
            "Password confirmation is required!"
        ),
    }).refine((data) => data.newPassword === data.newPasswordConfirm, {
        message: "Passwords do not match",
        path: ["newPasswordConfirm"],
    }),
});
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>["body"];
