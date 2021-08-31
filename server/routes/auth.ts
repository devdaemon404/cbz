import express from 'express';
import { login, userInfo, v1Login } from '../controllers/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: "auth"
 *  description: "Authenticate from v1 API"
 */

/**
 * @swagger
 * /api/v2/auth/v1-login:
 *
 *   post:
 *     tags:
 *     - "auth"
 *
 *     summary: Proxy - Authenticate from v1 API
 *
 *     description: Proxy - Authenticate from v1 API
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  description: Username
 *                  example: "sekhar_project_mgr"
 *                password:
 *                  type: string
 *                  description: Password.
 *                  example: "Test@123"
 *
 *     responses:
 *       '200':
 *         description: Login Successfull
 *         headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: access_token=abcde12345; Path=/; HttpOnly
 *       '401':
 *         description: Unauthorized
 *
 */

router.post('/v1-login', v1Login);

router.get('/login', login);
router.get('/user', userInfo);

export default router;
