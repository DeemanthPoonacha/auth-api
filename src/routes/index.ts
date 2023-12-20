import express from "express";
import userRouter from "./user.routes";
const router = express.Router();

router.get("/ping", (req, res) => res.sendStatus(200));
router.use(userRouter);
export default router;
