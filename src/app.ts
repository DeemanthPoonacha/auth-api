import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import config from "config";
import log from "./utils/logger";
import router from "./routes";
import connectToDb from "./utils/dbUtils";
import deserializeUser from "./middlewares/deserializeUser";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app: Express = express();

//middlewares
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: config.get("origin"),
        credentials: true,
    })
);
app.use(deserializeUser);
app.use(router);

const port = config.get("port");
app.listen(port, () => {
    log.info(`[server]: Server is running at http://localhost:${port}`);
    connectToDb();
});
