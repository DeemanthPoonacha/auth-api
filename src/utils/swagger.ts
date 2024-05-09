import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import log from "./logger";

const routes = ["./src/routes/*.ts", "./src/schemas/*.ts", "./src/app.ts"];
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version,
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
                url: "http://localhost:8080/",
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

async function swaggerDocs(app: Express, port: number) {
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
    const swaggerSpec = swaggerJsdoc(options); // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    log.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
