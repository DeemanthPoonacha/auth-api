import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import log from "./utils/logger";
import router from "./routes";
import connectToDb from "./utils/dbUtils";
import deserializeUser from "./middlewares/deserializeUser";

const app: Express = express();
app.use(express.json());
app.use(deserializeUser);
app.use(router);
app.get("/", (req: Request, res: Response) => {
    res.send("Authentification Server running on port " + port);
});

const port = config.get("port");
app.listen(port, () => {
    log.info(`[server]: Server is running at http://localhost:${port}`);
    connectToDb();
});
