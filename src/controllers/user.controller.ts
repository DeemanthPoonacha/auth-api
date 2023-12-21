import { Request, Response } from "express";
import { CreateUserInput, verifyUserInput } from "../scemas/user.schema";
import { createUser, findUserById } from "../setvices/user.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) {
    const body = req.body;
    try {
        const user = await createUser(body);
        await sendEmail({
            from: "admin@auth.com",
            to: user.email,
            subject: "Please verify your account",
            text: `Verification code: ${user.verificationCode}, Id: ${user._id}`,
        });
        return res.send("User created successfully");
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(409)
                .send(`Account with email: ${body.email} already exists`);
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
        if (user.verified) return res.send("User already verified!");
        if (verificationCode !== user.verificationCode) {
            return res.send("Invalid verification code");
        }

        user.verified = true;
        await user.save();
        return res.send("User verified successfully!");
    } catch (error) {
        return res.status(500).send(error);
    }
}
