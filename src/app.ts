import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import config from "config";
import log from "./utils/logger";
import router from "./routes";
import connectToDb from "./utils/dbUtils";
import deserializeUser from "./middlewares/deserializeUser";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app: Express = express();

//middlewares
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.json());

const corsConfig: CorsOptions = {
    origin: config.get("clientOrigin") || "http://localhost:3023",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Content-Length",
        "X-Requested-With",
        "Accept",
    ],
};
console.log("🚀 ~ corsConfig:", corsConfig);
app.use(cors(corsConfig));
app.use(deserializeUser);
app.use(router);
app.use((req, res, next) => {
    console.log(`Handling ${req.method} request to ${req.url}`);
    next();
});

app.get("/", (req, res) => res.send("Express Authentication Application!"));

const port = config.get("port");
app.listen(port, () => {
    log.info(`[server]: Server is running at http://localhost:${port}`);
    connectToDb();
});
