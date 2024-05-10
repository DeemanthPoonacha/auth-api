"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const swagger_1 = __importDefault(require("./utils/swagger"));
const app = (0, express_1.default)();
/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/healthcheck", (req, res) => res.sendStatus(200));
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
const cookieConfig = config_1.default.get("cookieConfig");
logger_1.default.info("Cookie Config:");
logger_1.default.info(cookieConfig);
logger_1.default.info("Cors Config:");
logger_1.default.info(corsConfig);
app.use((0, cors_1.default)(corsConfig));
app.use((req, res, next) => {
    logger_1.default.info(`Handling ${req.method} request to ${req.url} from ${req.headers.origin}`);
    next();
});
app.use(deserializeUser_1.default);
app.use(routes_1.default);
app.get("/", (req, res) => res.send(`
            <div 
                style='
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;'
            >
                <h1>Express Authentication Application!</h1>
                <h3>Find API Docs <a href='/docs'>here</></h3>
            </div>`));
const port = config_1.default.get("port");
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
    yield (0, dbUtils_1.default)();
    (0, swagger_1.default)(app, port);
}));
