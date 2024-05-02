"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const validateResource = (schema) => ({ body, params, query }, res, next) => {
    try {
        schema.parse({ body, params, query });
        next();
    }
    catch (error) {
        logger_1.default.error("Schema validation error");
        res.status(400).send(error.errors);
    }
};
exports.default = validateResource;
