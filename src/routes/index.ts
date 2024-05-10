import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
const router = express.Router();

router.get("/ping", (req, res) => res.status(200).send("Pong"));
router.use(userRouter);
router.use(authRouter);
export default router;
