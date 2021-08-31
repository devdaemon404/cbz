import express from 'express';

import {
  clientAdminApi,
  projectManagerApi,
  recuriterApi,
  vendorAdminApi,
} from '../controllers/dashboard';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: "dashboard"
 *  description: "Dashboard API's"
 */

/**
 * @swagger
 * /api/v2/dashboard/ca/{clientId}:
 *
 *   get:
 *     tags:
 *     - "dashboard"
 *
 *     summary: Call all API's for Client Admin
 *
 *     parameters:
 *      - in: path
 *        name: clientId
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the client
 *
 *
 *     responses:
 *       '200':
 *         description: All API's for client Admin
 *       '401':
 *         description: Unauthorized
 *
 */
router.get('/ca/:clientId', clientAdminApi);

/**
 * @swagger
 * /api/v2/dashboard/pm/{userId}:
 *
 *   get:
 *     tags:
 *     - "dashboard"
 *
 *     summary: Call all API's for PM
 *
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the user
 *
 *
 *     responses:
 *       '200':
 *         description: All API's for Project Manager
 *       '401':
 *         description: Unauthorized
 *
 */
router.get('/pm/:userId', projectManagerApi);

/**
 * @swagger
 * /api/v2/dashboard/va/{vendorId}:
 *
 *   get:
 *     tags:
 *     - "dashboard"
 *
 *     summary: Call all API's for Vendor Admin
 *
 *     parameters:
 *      - in: path
 *        name: vendorId
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the vendor
 *
 *
 *     responses:
 *       '200':
 *         description: All API's for Vendor Admin
 *       '401':
 *         description: Unauthorized
 *
 */
router.get('/va/:vendorId', vendorAdminApi);

/**
 * @swagger
 * /api/v2/dashboard/re/{userId}:
 *
 *   get:
 *     tags:
 *     - "dashboard"
 *
 *     summary: Call all API's for Recuriter
 *
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the user
 *
 *
 *     responses:
 *       '200':
 *         description: All API's for Recuriter
 *       '401':
 *         description: Unauthorized
 *
 */
router.get('/re/:userId', recuriterApi);

export default router;
