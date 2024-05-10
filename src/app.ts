import dotenv from "dotenv";
dotenv.config();
import express, { CookieOptions, Express } from "express";
import config from "config";
import log from "./utils/logger";
import router from "./routes";
import connectToDb from "./utils/dbUtils";
import deserializeUser from "./middlewares/deserializeUser";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swaggerDocs from "./utils/swagger";
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
const cookieConfig = config.get<CookieOptions>("cookieConfig");
log.info("Cookie Config:");
log.info(cookieConfig);
log.info("Cors Config:");
log.info(corsConfig);
app.use(cors(corsConfig));
app.use((req, res, next) => {
    log.info(
        `Handling ${req.method} request to ${req.url} from ${req.headers.origin}`
    );
    next();
});
app.use(deserializeUser);
app.use(router);
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

app.get("/", (req, res) =>
    res.send(`
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
            </div>`)
);

const port = config.get("port") as number;
app.listen(port, async () => {
    log.info(`[server]: Server is running at http://localhost:${port}`);
    await connectToDb();
    swaggerDocs(app, port);
});
