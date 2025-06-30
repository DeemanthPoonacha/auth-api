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
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const package_json_1 = require("../../package.json");
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("config"));
const routes = ["./src/routes/*.ts", "./src/schemas/*.ts", "./src/app.ts"];
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: package_json_1.version,
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: config_1.default.get("serverOrigin") || "http://localhost:8080", // Server URL
            },
        ],
        tags: [
            {
                name: "", // Tag name
                description: "", // Tag description
            },
        ],
    },
    apis: routes,
};
function swaggerDocs(app, port) {
    return __awaiter(this, void 0, void 0, function* () {
        // const swaggerSpec = (
        //     (await swaggerAutogen({ openapi: "3.0.0" })(
        //         "docs/swagger-output.json",
        //         routes,
        //         options.definition
        //     )) as {
        //         success: boolean;
        //         data: any;
        //     }
        // ).data;
        const swaggerSpec = (0, swagger_jsdoc_1.default)(options); // Swagger page
        app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
        // Docs in JSON format
        app.get("/docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });
        logger_1.default.info(`Docs available at http://localhost:${port}/docs`);
    });
}
exports.default = swaggerDocs;
