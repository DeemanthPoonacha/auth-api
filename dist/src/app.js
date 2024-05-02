"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const dbUtils_1 = __importDefault(require("./utils/dbUtils"));
const deserializeUser_1 = __importDefault(require("./middlewares/deserializeUser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
process.env["NODE_CONFIG_DIR"] = path_1.default.join(path_1.default.resolve("./"), "config/");
//middlewares
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const corsConfig = {
    origin: config_1.default.get("clientOrigin") || "http://localhost:3023",
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
    if (req.method === "POST")
        req.body = JSON.parse(req.body);
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
app.use(deserializeUser_1.default);
app.use(routes_1.default);
app.get("/", (req, res) => res.send("Express Authentication on Vercel"));
const port = config_1.default.get("port") || 8080;
app.listen(port, () => {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
    (0, dbUtils_1.default)();
});
exports.default = app;
