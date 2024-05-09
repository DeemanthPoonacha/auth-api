"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = void 0;
const zod_1 = require("zod");
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateSessionInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           default: jane.doe@example.com
 *           description: The email address of the user
 *         password:
 *           type: string
 *           default: stringPassword123
 *           description: The password of the user
 *
 *     CreateSessionResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Access token for authentication.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         fullName:
 *           type: string
 *           description: The full name of the user.
 *         refreshToken:
 *           type: string
 *           description: Refresh token for authentication.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was last updated.
 *         _id:
 *           type: string
 *           description: The unique identifier of the user.
 */
exports.createSessionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required!",
        }).email("Invalid credentials!"),
        password: (0, zod_1.string)({
            required_error: "Password is required!",
        }).min(6, "Invalid Credentials!"),
    }),
});
