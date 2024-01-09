import { TypeOf, object, string } from "zod";

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
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

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

export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
    }),
});

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

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
