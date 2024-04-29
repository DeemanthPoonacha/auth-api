"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const auth_schema_1 = require("../schemas/auth.schema");
const auth_controller_1 = require("../controllers/auth.controller");
const requireUser_1 = __importDefault(require("../middlewares/requireUser"));
const apiPaths_1 = require("../constants/apiPaths");
const authRouter = express_1.default.Router();
// Login user
authRouter.post(apiPaths_1.LOGIN_API_PATH, (0, validateResource_1.default)(auth_schema_1.createSessionSchema), auth_controller_1.createSessionHandler);
// Logout user
authRouter.delete(apiPaths_1.LOGOUT_API_PATH, requireUser_1.default, auth_controller_1.invalidateSessionHandler);
// refresh access token
authRouter.post(apiPaths_1.REFRESH_ACCESS_TOKEN_API_PATH, auth_controller_1.refreshAccessTokenHandler);
exports.default = authRouter;
