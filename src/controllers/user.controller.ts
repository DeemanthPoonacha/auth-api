import { Request, Response } from "express";
import {
    CreateUserInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    verifyUserInput,
} from "../scemas/user.schema";
import {
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
} from "../setvices/user.service";
import { invalidateUserSessions } from "../setvices/auth.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import config from "config";
import { CurrentUser } from "../types/user";
const senderMailId = config.get<string>("senderMailId");

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) {
    const body = req.body;
    try {
        const user = await createUser(body);
        await sendEmail({
            from: senderMailId,
            to: user.email,
            subject: "Please verify your account",
            html: `<p>To verify your email address, <a href="http://localhost:8080/api/users/${user._id}/verify/${user.verificationCode}">Click Here</a>.</p>`,
        });
        return res.send("User created successfully!");
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(409)
                .send(`Account with email (${body.email}) already exists.`);
        }
        return res.status(500).send(error);
    }
}

export async function verifyUserHandler(
    req: Request<verifyUserInput>,
    res: Response
) {
    const { id, verificationCode } = req.params;
    try {
        const user = await findUserById(id);

        if (!user) return res.send("User not found!");
        const frontendOrigin = config.get("origin");
        if (user.verified)
            return res.send(`
        <div>
            <p>User already verified!</p>
            <p>To login to your account, <a href="${frontendOrigin}/auth/login">Click Here</a>.</p>
        </div>`);
        if (verificationCode !== user.verificationCode) {
            return res.send("Invalid verification code");
        }

        user.verified = true;
        await user.save();
        return res.send(`
        <div>
            <p>User verified successfully!</p>
            <p>To login to your account, <a href="${frontendOrigin}/auth/login">Click Here</a>.</p>
        </div>`);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response
) {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    const message = `A password reset email will be sent to the ${email} if user is registered.`;
    if (!user) {
        log.info(`User with email:${email} not found in DB`);
        return res.send(message);
    }
    if (!user.verified) return res.send("User not verified!");

    const passwordResetCode = uuidv4();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    await sendEmail({
        from: senderMailId,
        to: user.email,
        subject: "Password reset email",
        text: `Password reset code: ${passwordResetCode}, Id: ${user._id}`,
    });
    return res.send(message);
}

export async function resetPasswordHandler(
    req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
    res: Response
) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    const user = await findUserById(id);

    if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
    ) {
        if (!user) log.info("User not found");
        if (!user?.passwordResetCode) log.info("No password reset code found");
        if (user?.passwordResetCode !== passwordResetCode)
            log.info("Password reset code mismatch");

        return res.status(400).send("Couldn't reset password!");
    }

    user.password = password;
    user.passwordResetCode = null;
    await user.save();

    return res.send("Password reset successfully!");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.locals.user);
}

export async function deleteUserHandler(req: Request, res: Response) {
    const message = "Couldn't delete user";

    const user: CurrentUser = res.locals.user;
    if (!user) {
        log.info("User not logged in");
        return res.status(400).send(message);
    }

    const result = await deleteUserById(String(user._id));
    if (!result.deletedCount) {
        log.info("User not found in DB");
        return res.status(400).send(message);
    }

    await invalidateUserSessions({ userId: String(user._id) });
    return res.send("User deleted successfully!");
}
