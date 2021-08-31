import express from 'express';

import {
  createInvoice,
  getInvoiceForClient,
  getInvoiceForVendor,
} from '../controllers/invoice';

import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: "invoice"
 *  description: "Invoice routes"
 */

/**
 * @swagger
 * /api/v2/invoice:
 *
 *  post:
 *    tags:
 *    - "invoice"
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
 *              vendorId:
 *                type: string
 *              fileKey:
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
router.post(
  '/',
  body('clientId').isMongoId().exists(),
  body('vendorId').isMongoId().exists(),
  body('fileKey').isString().exists(),
  validateRequest,
  createInvoice,
);

/**
 * @swagger
 * /api/v2/invoice/client/{clientId}:
 *
 *  get:
 *    tags:
 *    - "invoice"
 *    summary: Get all invoices for client
 *
 *    description: Get all invoices for client
 *
 *    parameters:
 *     - in: path
 *       name: clientId
 *       schema:
 *         type: string
 *       required: true
 *
 *    responses:
 *      '200':
 *        description: data fetched
 *      '400':
 *        description: Insufficent data
 */
router.get('/client/:clientId', getInvoiceForClient);

/**
 * @swagger
 * /api/v2/invoice/vendor/{vendorId}:
 *
 *  get:
 *    tags:
 *    - "invoice"
 *    summary: Get all invoices for vendor
 *
 *    description: Get all invoices for vendor
 *
 *    parameters:
 *     - in: path
 *       name: vendorId
 *       schema:
 *         type: string
 *       required: true
 *
 *    responses:
 *      '200':
 *        description: data fetched
 *      '400':
 *        description: Insufficent data
 */
router.get('/vendor/:vendorId', getInvoiceForVendor);

export default router;
