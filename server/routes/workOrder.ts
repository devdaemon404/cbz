import express from 'express';
const router = express.Router();

import { body, query, param } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

const validateStringField = (field: string) =>
  body(field)
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage(`${field} must be provided and should be a valid string`);

import {
  createWorkOrder,
  addChangesToWorkOrder,
  getAllWorkOrderData,
  updateWorkOrderStatus,
  getWorkOrder,
  getAllWorkOrderDataOfVendor,
  getWorkOrderForProfile,
  getClientCount,
  getVendorCount,
  checkIfWorkOrderExists,
  getWorkOrderForPM,
  getWorkOrderForEmployee,
} from '../controllers/workOrder';

import { authenticateFromV1Api, authorizeFromV1Api } from '../middleware/auth';

/**
 * @swagger
 * tags:
 *  name: "work-order"
 *  description: "work-order routes"
 */

/**
 * @swagger
 * /api/v2/work-order:
 *
 *   post:
 *     tags:
 *     - "work-order"
 *     summary: Create a work-order document
 *
 *     description: Create a work-order document
 *     parameters:
 *      - in: query
 *        name: clientId
 *        schema:
 *          type: string
 *          example: 5f999a6ba208c871ec9ad2ef
 *      - in: query
 *        name: vendorId
 *        schema:
 *          type: string
 *          example: 5f8e6dbb005f854cf0b0e95b
 *      - in: query
 *        name: demandId
 *        schema:
 *          type: string
 *          example: 5f897fc4e5daed54edb656eb
 *      - in: query
 *        name: profileId
 *        schema:
 *          type: string
 *          example: 5f8980d1e5daed54edb656f1
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                requestedResource:
 *                  type: string
 *                officalEmail:
 *                  type: string
 *                posTitle:
 *                  type: string
 *                posId:
 *                  type: string
 *                posReportsTo:
 *                  type: string
 *                jobType:
 *                  type: string
 *                rateType:
 *                  type: string
 *                contractedFee:
 *                  type: string
 *                assignmentDesc:
 *                  type: string
 *                startDate:
 *                  type: string
 *                  format: date
 *                duration:
 *                  type: string
 *                endDate:
 *                  type: string
 *                  format: date
 *                estimatedTotalSpend:
 *                  type: string
 *                estimatedRemainingBudget:
 *                  type: string
 *                allowExpenses:
 *                  type: boolean
 *                cvLink:
 *                  type: string
 *
 *
 *     responses:
 *       '201':
 *         description: work-order has been created
 *       '400':
 *         description: There are missing fields in the request body
 *
 */

router.post(
  '/',
  // Validate request body
  validateStringField('requestedResource'),
  validateStringField('officialEmail'),
  // validateStringField('posTitle'),
  // validateStringField('posId'),
  validateStringField('posReportsTo'),
  validateStringField('jobType'),
  validateStringField('rateType'),
  // validateStringField('assignmentDesc'),
  // validateStringField('contractedFee'),
  validateStringField('startDate'),
  validateStringField('duration'),
  validateStringField('endDate'),
  // validateStringField('estimatedTotalSpend'),
  // validateStringField('estimatedRemainingBudget'),
  // body('allowExpenses').isBoolean(),
  // validateStringField('cvLink'),
  query('clientId').isMongoId().withMessage('Client Id not specified'),
  query('vendorId').isMongoId().withMessage('Vendor Id not specified'),
  query('demandId').isMongoId().withMessage('Demand Id not specified'),
  query('profileId').isMongoId().withMessage('Profile Id not specified'),
  ////

  authenticateFromV1Api,
  authorizeFromV1Api('CLIENT_MANAGER'),
  validateRequest,
  createWorkOrder,
);

/**
 * @swagger
 * /api/v2/work-order/client/{clientId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Fetch all work-order data
 *
 *     description: Fetch all work-order data
 *     parameters:
 *      - in: path
 *        name: clientId
 *        schema:
 *          type: string
 *          example: 5f8972eae5daed54edb656e2
 *        required: true
 *        description: The mongodb ID of the client doc
 *
 *     responses:
 *       '200':
 *         description: Data of all work-order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  requestedResource:
 *                    type: string
 *                  id:
 *                    type: string
 *                  officalEmail:
 *                    type: string
 *                  posTitle:
 *                    type: string
 *                  posId:
 *                    type: string
 *                  posReportsTo:
 *                    type: string
 *                  jobType:
 *                    type: string
 *                  rateType:
 *                    type: string
 *                  assignmentDesc:
 *                    type: string
 *                  startDate:
 *                    type: string
 *                    format: date
 *                  duration:
 *                    type: string
 *                  endDate:
 *                    type: string
 *                    format: date
 *                  estimatedTotalSpend:
 *                    type: string
 *                  estimatedRemainingBudget:
 *                    type: string
 *                  allowExpenses:
 *                    type: boolean
 *                  cvLink:
 *                    type: string
 *                  vendor:
 *                    type: object
 *                  client:
 *                    type: object
 *
 *
 *
 */

router.get(
  '/client/:clientId',

  param('clientId')
    .isMongoId()
    .withMessage('Client Id Should be a valid mongodb ID'),
  // authenticateFromV1Api,
  // authorizeFromV1Api('CLIENT_MANAGER'),
  getAllWorkOrderData,
);

/**
 * @swagger
 * /api/v2/work-order/vendor/{vendorId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Fetch all work-order data
 *
 *     description: Fetch all work-order data
 *     parameters:
 *      - in: path
 *        name: vendorId
 *        schema:
 *          type: string
 *          example: 5f8852a4861ccb715d47fd55
 *        required: true
 *        description: The mongodb ID of the vendor doc
 *
 *     responses:
 *       '200':
 *         description: Data of all work-order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  requestedResource:
 *                    type: string
 *                  id:
 *                    type: string
 *                  officalEmail:
 *                    type: string
 *                  posTitle:
 *                    type: string
 *                  posId:
 *                    type: string
 *                  posReportsTo:
 *                    type: string
 *                  jobType:
 *                    type: string
 *                  rateType:
 *                    type: string
 *                  assignmentDesc:
 *                    type: string
 *                  startDate:
 *                    type: string
 *                    format: date
 *                  duration:
 *                    type: string
 *                  endDate:
 *                    type: string
 *                    format: date
 *                  estimatedTotalSpend:
 *                    type: string
 *                  estimatedRemainingBudget:
 *                    type: string
 *                  allowExpenses:
 *                    type: boolean
 *                  cvLink:
 *                    type: string
 *                  vendor:
 *                    type: object
 *                  client:
 *                    type: object
 *
 *
 *
 */

router.get(
  '/vendor/:vendorId',
  // authenticateFromV1Api,
  // authorizeFromV1Api('CLIENT_MANAGER', 'PROJECT_MANAGER'),

  param('vendorId')
    .isMongoId()
    .withMessage('Vendor Id Should be a valid mongodb ID'),
  getAllWorkOrderDataOfVendor,
);

/**
 * @swagger
 * /api/v2/work-order/{id}:
 *
 *   patch:
 *     tags:
 *     - "work-order"
 *     summary: Update the work order document
 *
 *     description: Update the work order document for demonstration purposes we are adding one field but any field can be updated using this API
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the document
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                posTitle:
 *                  type: string
 *                role:
 *                  type: string
 *                  description: Temporary field SEND PROJECT_MANAGER, CLIENT_MANAGER, VICE_PRESIDENT, VENDOR_ADMIN
 *                  example: CLIENT_MANAGER
 *
 *     responses:
 *       '200':
 *         description: work-order has been updated
 *       '400':
 *         description: No such work-order with the id exists
 */
router.patch(
  '/:id',
  authenticateFromV1Api,
  authorizeFromV1Api('CLIENT_MANAGER'),
  addChangesToWorkOrder,
);

/**
 * @swagger
 * /api/v2/work-order/status/{id}:
 *
 *   patch:
 *     tags:
 *     - "work-order"
 *     summary: Update the status of work order document
 *
 *     description: Update the status of document. Note send only APPROVED, DROPPED or AMEND status. Role field to be sent temporarily until authorization is added
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The mongodb ID of the work-order document
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: Send APPROVED, DROPPED or AMEND
 *                  example: DROPPED
 *                role:
 *                  type: string
 *                  description: Temporary field SEND PROJECT_MANAGER, CLIENT_MANAGER, VICE_PRESIDENT, VENDOR_ADMIN
 *                  example: PROJECT_MANAGER
 *                user_id:
 *                  type: string
 *                  description: Temporary field SEND user_id
 *                  example: 5f896f9ee5daed54edb656e0
 *                suggestion:
 *                  type: string
 *                  description: Send only if you want to amend
 *
 *
 *     responses:
 *       '200':
 *         description: work-order status has been updated
 *       '400':
 *         description: No such work-order with the id exists
 */

router.patch(
  '/status/:id',
  authenticateFromV1Api,
  authorizeFromV1Api(
    'CLIENT_MANAGER',
    'PROJECT_MANAGER',
    'VICE_PRESIDENT',
    'VENDOR_ADMIN',
  ),

  validateStringField('status'),
  validateRequest,
  updateWorkOrderStatus,
);

/**
 * @swagger
 * /api/v2/work-order/check-for-profile:
 *
 *   post:
 *     tags:
 *     - "work-order"
 *     summary: Check whether work order exists for profile IDs
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                profileIdArr:
 *                  type: array
 *                  items:
 *                    type: string
 *
 *     description: Check whether work order exists for profile IDs
 *     responses:
 *       '200':
 *         description: Checked for all profiles
 */
router.post('/check-for-profile', checkIfWorkOrderExists);
/**
 * @swagger
 * /api/v2/work-order/{workOrderId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Get data of a work order
 *
 *     description: Get data of a work order
 *     parameters:
 *      - in: path
 *        name: workOrderId
 *        schema:
 *          type: string
 *          example: 600933537ac49728b4da012e
 *
 *     responses:
 *       '200':
 *         description: work-order with the id has been fetched
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                requestedResource:
 *                  type: string
 *                id:
 *                  type: string
 *                officalEmail:
 *                  type: string
 *                posTitle:
 *                  type: string
 *                posId:
 *                  type: string
 *                posReportsTo:
 *                  type: string
 *                jobType:
 *                  type: string
 *                rateType:
 *                  type: string
 *                assignmentDesc:
 *                  type: string
 *                startDate:
 *                  type: string
 *                  format: date
 *                duration:
 *                  type: string
 *                endDate:
 *                  type: string
 *                  format: date
 *                estimatedTotalSpend:
 *                  type: string
 *                estimatedRemainingBudget:
 *                  type: string
 *                allowExpenses:
 *                  type: boolean
 *                cvLink:
 *                  type: string
 *                vendor:
 *                  type: object
 *                client:
 *                  type: object
 *       '400':
 *         description: There are missing fields in the request body
 *
 */

router.get(
  '/:workOrderId',
  // authenticateFromV1Api,
  // authorizeFromV1Api('CLIENT_MANAGER', 'PROJECT_MANAGER'),

  param('workOrderId')
    .isMongoId()
    .withMessage('Id of the work order should be provided'),
  validateRequest,
  getWorkOrder,
);

/**
 * @swagger
 * /api/v2/work-order/profile/{profileId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Get data of a work order
 *
 *     description: Get data of a work order
 *     parameters:
 *      - in: path
 *        name: profileId
 *        schema:
 *          type: string
 *          example: 5f8980d1e5daed54edb656f1
 *
 *     responses:
 *       '200':
 *         description: work-order with the id has been fetched
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                requestedResource:
 *                  type: string
 *                id:
 *                  type: string
 *                officalEmail:
 *                  type: string
 *                posTitle:
 *                  type: string
 *                posId:
 *                  type: string
 *                posReportsTo:
 *                  type: string
 *                jobType:
 *                  type: string
 *                rateType:
 *                  type: string
 *                assignmentDesc:
 *                  type: string
 *                startDate:
 *                  type: string
 *                  format: date
 *                duration:
 *                  type: string
 *                endDate:
 *                  type: string
 *                  format: date
 *                estimatedTotalSpend:
 *                  type: string
 *                estimatedRemainingBudget:
 *                  type: string
 *                allowExpenses:
 *                  type: boolean
 *                cvLink:
 *                  type: string
 *                vendor:
 *                  type: object
 *                client:
 *                  type: object
 *       '400':
 *         description: There are missing fields in the request body
 *
 */

router.get(
  '/profile/:profileId',
  // authenticateFromV1Api,
  // authorizeFromV1Api('CLIENT_MANAGER', 'PROJECT_MANAGER'),

  param('profileId')
    .isMongoId()
    .withMessage('Id of the profile should be provided'),
  validateRequest,
  getWorkOrderForProfile,
);

/**
 * @swagger
 * /api/v2/work-order/get-count-client/{clientId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: get count for client ID
 *
 *     description: get count for client ID
 *     parameters:
 *      - in: path
 *        name: clientId
 *        schema:
 *          type: string
 *          example: 5f8972eae5daed54edb656e2
 *        required: true
 *        description: The mongodb ID of the client doc
 *
 *     responses:
 *       '200':
 *         description: count
 *
 *
 *
 */

router.get(
  '/get-count-client/:clientId',
  // authenticateFromV1Api,
  // authorizeFromV1Api('CLIENT_MANAGER', 'PROJECT_MANAGER'),

  param('clientId')
    .isMongoId()
    .withMessage('Client Id Should be a valid mongodb ID'),
  getClientCount,
);

/**
 * @swagger
 * /api/v2/work-order/get-count-vendor/{vendorId}:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Get count of workOrder for vendor ID
 *
 *     description: Get count of workOrder for vendor ID
 *     parameters:
 *      - in: path
 *        name: vendorId
 *        schema:
 *          type: string
 *          example: 5f8852a4861ccb715d47fd55
 *        required: true
 *        description: The mongodb ID of the vendor doc
 *
 *     responses:
 *       '200':
 *         description: The count of the workOrder
 *
 */

router.get(
  '/get-count-vendor/:vendorId',

  param('vendorId')
    .isMongoId()
    .withMessage('Vendor Id Should be a valid mongodb ID'),
  getVendorCount,
);

/**
 * @swagger
 * /api/v2/work-order/pm/all:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Get all work orders for a project manager
 *
 *     description: Get all work orders for a project manager
 *
 *     responses:
 *       '200':
 *         description: All work order data for project manager
 *
 */

router.get(
  '/pm/all',

  authenticateFromV1Api,
  authorizeFromV1Api('PROJECT_MANAGER'),
  getWorkOrderForPM,
);

/**
 * @swagger
 * /api/v2/work-order/get-for-emp:
 *
 *   get:
 *     tags:
 *     - "work-order"
 *     summary: Get all work orders for a employee work in progress dont use
 *
 *     description: Get all work orders for a employee
 *
 *     responses:
 *       '200':
 *         description: All work order data for employee
 *
 */
router.get('/get-for-emp', authenticateFromV1Api, getWorkOrderForEmployee);

export default router;
