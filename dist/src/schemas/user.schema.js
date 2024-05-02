"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyUserSchema = exports.resendVerificationSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
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
exports.updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        fullName: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)().email("Invalid email address!").optional(),
        image: (0, zod_1.string)().optional(),
    }),
});
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
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required!",
        }).email("Invalid email address!"),
    }),
});
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
