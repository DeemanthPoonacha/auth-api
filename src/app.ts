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
import path from "path";

const app: Express = express();
process.env["NODE_CONFIG_DIR"] = path.join(path.resolve("./"), "config/");

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

app.use(function (req, res, next) {
    console.log("🚀 ~ req.body before:", req.body);
    if (req.method === "PATCH") req.body = JSON.parse(req.body);
    console.log("🚀 ~ req.body after:", req.body);
    next();
});
// app.use(cors(corsConfig));
app.use(function (req, res, next) {
    // res.header(
    //     "Access-Control-Allow-Origin",
    //     config.get("clientOrigin") || "http://localhost:3023"
    // );
    // res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET,PUT,PATCH,POST,DELETE,OPTIONS"
    // );
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
    // );
    // res.header("Access-Control-Allow-Credentials", "true");

    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // // another common pattern
    // // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // res.setHeader(
    //     "Access-Control-Allow-Methods",
    //     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    // );
    // res.setHeader(
    //     "Access-Control-Allow-Headers",
    //     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    // );
    // if (req.method === "OPTIONS") {
    //     res.status(200).end();
    //     return;
    // }
    console.log("🚀 ~ res:", req.originalUrl);
    next();
});
app.options("/*", (_, res) => {
    res.sendStatus(200);
});
console.log("Cors configuration", corsConfig);

app.use(deserializeUser);
app.use(router);

app.get("/", (req, res) => res.send("Express Authentication on Vercel"));
const port = config.get("port") || 8080;
app.listen(port, () => {
    log.info(`[server]: Server is running at http://localhost:${port}`);
    connectToDb();
});

export default app;
