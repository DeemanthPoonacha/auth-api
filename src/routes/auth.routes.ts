import express from "express";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schemas/auth.schema";
import {
    createSessionHandler,
    invalidateSessionHandler,
    refreshAccessTokenHandler,
} from "../controllers/auth.controller";
import requireUser from "../middlewares/requireUser";
import {
    LOGIN_API_PATH,
    LOGOUT_API_PATH,
    REFRESH_ACCESS_TOKEN_API_PATH,
} from "../constants/apiPaths";

const authRouter = express.Router();

// Login user
/**
 * @openapi
 * /api/sessions:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Login a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSessionResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid credentials!
 *       202:
 *         description: Email verification pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *                   description: Path to navigate for email verification.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
authRouter.post(
    LOGIN_API_PATH,
    validateResource(createSessionSchema),
    createSessionHandler
);

// Logout user
/**
 * @openapi
 * '/api/sessions':
 *   delete:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Invalidate the current user's session and clear cookies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: null
 *                   description: Access token set to null indicating logout.
 *                 refreshToken:
 *                   type: null
 *                   description: Refresh token set to null indicating logout.
 *       403:
 *         description: Forbidden - user not logged in
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */

authRouter.delete(LOGOUT_API_PATH, requireUser, invalidateSessionHandler);

// refresh access token
/**
 * @openapi
 * '/api/sessions/refresh':
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Refresh the access token using the refresh token stored in cookies or headers.
 *     parameters:
 *       - name: x-refresh
 *         in: header
 *         type: string
 *         description: Refresh token for new access token
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token issued for authentication.
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: could not refresh access token
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
authRouter.post(REFRESH_ACCESS_TOKEN_API_PATH, refreshAccessTokenHandler);

export default authRouter;
