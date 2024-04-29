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
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
//middlewares
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: config_1.default.get("clientOrigin"),
    credentials: true,
}));
app.use(deserializeUser_1.default);
app.use(routes_1.default);
app.get("/", (req, res) => res.send("Express Authentication on Vercel"));
const port = config_1.default.get("port");
app.listen(port, () => {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
    (0, dbUtils_1.default)();
});
exports.default = app;
