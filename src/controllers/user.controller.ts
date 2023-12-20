import { Request, Response } from "express";
import { CreateUserInput } from "../scemas/user.schema";
import { createUser } from "../setvices/user.service";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) {
    const body = req.body;
    try {
        const user = await createUser(body);
        return res.send("User created successfully");
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(409)
                .send(`Account with email: ${body.email} already exists`);
        }
    }
}
