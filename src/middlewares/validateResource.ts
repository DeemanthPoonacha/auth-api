import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import log from "../utils/logger";

const validateResource =
    (schema: AnyZodObject) =>
    ({ body, params, query }: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({ body, params, query });
            next();
        } catch (error: any) {
            log.error("Schema validation error");
            res.status(400).send(error.errors);
        }
    };

export default validateResource;
