import express from 'express';
import { addRequestIdToDemand } from '../controllers/demand';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: "demand"
 *  description: "Demand API's"
 */

/**
 * @swagger
 * /api/v2/demand/requestId:
 *
 *  post:
 *    tags:
 *    - "demand"
 *
 *    summary: Create a Invoice
 *    description: Create a Invoice
 *
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              clientId:
 *                type: string
 *              demandId:
 *                type: string
 *
 *
 *    responses:
 *      '200':
 *        description: invoice has been created
 *      '400':
 *        description: Insufficent data
 *
 */
router.post('/requestId', addRequestIdToDemand);

export default router;
