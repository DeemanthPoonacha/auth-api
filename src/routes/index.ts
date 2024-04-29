import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
const router = express.Router();

router.get("/", (req, res) => res.send("Express on Vercel"));
router.get("/ping", (req, res) => res.sendStatus(200));
router.use(userRouter);
router.use(authRouter);
export default router;
