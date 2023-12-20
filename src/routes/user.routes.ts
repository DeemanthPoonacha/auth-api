import express from "express";
import validateResource from "../middlewares/validateResource";
import { createUserSchema } from "../scemas/user.schema";
import { createUserHandler } from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserHandler
);

export default userRouter;
