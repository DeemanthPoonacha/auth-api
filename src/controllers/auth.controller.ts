import { Request, Response } from "express";
import { CreateSessionInput } from "../scemas/auth.schema";
import { findUserByEmail } from "../setvices/user.service";
import { signAccessToken, signRefreshToken } from "../setvices/auth.service";

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const { email, password } = req.body;
    const message = "Invalid credentials!";

    const user = await findUserByEmail(email);
    if (!user) return res.send(message);
    if (!user.verified) return res.send("Please verify your email.");

    const isValid = await user.validatePassword(password);
    if (!isValid) return res.send(message);

    const accessToken = signAccessToken(user);
    console.log(user._id);

    const refreshToken = await signRefreshToken({ userId: user._id });

    return res.send({ accessToken, refreshToken });
}
