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
            required_error: "Email is required",
        }).email("Invalid email address"),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
