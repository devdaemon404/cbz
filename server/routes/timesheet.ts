import express from 'express';
const router = express.Router();

import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

import {
  createTimesheet,
  getAllTimesheetsForEmployee,
  getAllTimesheetsForProject,
  getTimesheetForProfile,
  getTimesheetForProfileForWeek,
  updateStatusToApproval,
  updateStatusToPosted,
  updateTimesheet,
  updateTimesheetData,
  generatePdf,
  getCountForProject,
  getCountForEmployee,
  getTimesheetsForVendor,
  getTimesheetForProjectAndEmployee,
  getInvoiceData,
} from '../controllers/timesheetV3';

// import { authenticateFromV1Api, authorizeFromV1Api } from '../middleware/auth';

/**
 * @swagger
 * tags:
 *  name: "Timesheet"
 *  description: "Timesheet routes"
 */

/**
 * @swagger
 * /api/v2/timesheet/:
 *
 *   post:
 *     tags:
 *     - "Timesheet"
 *     summary: Create a new timesheet
 *
 *     description: Create a new timesheet
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                tasks:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      taskName:
 *                        type: string
 *                      weekData:
 *                        type: object
 *                        properties:
 *                          Sun:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Mon:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Tue:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Wed:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                          Thu:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Fri:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Sat:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                weekNumber:
 *                  type: number
 *                year:
 *                  type: string
 *                projectId:
 *                  type: string
 *                  example: 5fed744c2187ce7aae6cd86b
 *                employeeId:
 *                  type: string
 *                  example: 5ff740287cf66c42cc7f852c
 *     responses:
 *       '201':
 *         description: Timesheet has been created
 *       '400':
 *         description: There are missing fields in the request body or data provided is not correct
 */

router.post(
  '/',
  body('projectId')
    .exists()
    .isMongoId()
    .withMessage('Project ID should be provided'),
  body('employeeId')
    .exists()
    .isMongoId()
    .withMessage('Employee ID should be provided'),
  body('tasks').exists().isArray().withMessage('Tasks should be provided'),
  body('tasks.*.weekData').exists().withMessage('Week data should be provided'),
  body('tasks.*.taskName').exists().withMessage('Task name should be provided'),
  body('weekNumber')
    .exists()
    .isInt()
    .withMessage('week number should be provided'),
  body('year')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Year should be provided'),
  validateRequest,
  createTimesheet,
);

/**
 * @swagger
 * /api/v2/timesheet/project:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetch all timesheet data for a project
 *
 *     description: Fetch all timesheet data for a project
 *     parameters:
 *      - in: query
 *        name: projectId
 *        schema:
 *          type: string
 *          example: 5fed744c2187ce7aae6cd86b
 *        required: true
 *        description: The mongodb ID of the project
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *
 *     responses:
 *       '200':
 *         description: Data of all timesheet for the project
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                id:
 *                  type: string
 *                  description: empId-weekNumber-year-Version
 *                weekNumber:
 *                  type: number
 *                year:
 *                  type: string
 *                projectId:
 *                  type: string
 *                employeeId:
 *                  type: string
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      suggestion:
 *                        type: string
 *                      status:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                      tasks:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            taskName:
 *                              type: string
 *                            weekData:
 *                              type: object
 *                              properties:
 *                                Sun:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Mon:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Tue:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Wed:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Thu:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Fri:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Sat:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *
 *
 */

router.get(
  '/project',
  query('projectId')
    .exists()
    .isMongoId()
    .withMessage('Project Id should be provided'),
  query('weekNumber')
    .exists()
    .isNumeric()
    .withMessage('Week Number should be provided'),
  query('year')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Year should be provided'),
  validateRequest,
  getAllTimesheetsForProject,
);

/**
 * @swagger
 * /api/v2/timesheet/project/employee:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetch all timesheet data for a project and employee
 *
 *     description: Fetch all timesheet data for a project and employee
 *     parameters:
 *      - in: query
 *        name: projectId
 *        schema:
 *          type: string
 *          example: 5fed744c2187ce7aae6cd86b
 *        required: true
 *        description: The mongodb ID of the project
 *      - in: query
 *        name: employeeId
 *        schema:
 *          type: string
 *          example: 5ff740287cf66c42cc7f852c
 *        required: true
 *        description: The mongodb ID of the employee
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *
 *     responses:
 *       '200':
 *         description: Data of all timesheet for the project
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                id:
 *                  type: string
 *                  description: empId-weekNumber-year-Version
 *                weekNumber:
 *                  type: number
 *                year:
 *                  type: string
 *                projectId:
 *                  type: string
 *                employeeId:
 *                  type: string
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      suggestion:
 *                        type: string
 *                      status:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                      tasks:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            taskName:
 *                              type: string
 *                            weekData:
 *                              type: object
 *                              properties:
 *                                Sun:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Mon:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Tue:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Wed:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Thu:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Fri:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Sat:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *
 *
 */
router.get(
  '/project/employee',
  query('projectId')
    .exists()
    .isMongoId()
    .withMessage('Project Id should be provided'),
  query('employeeId')
    .exists()
    .isMongoId()
    .withMessage('Employee Id should be provided'),
  query('weekNumber')
    .exists()
    .isNumeric()
    .withMessage('Week Number should be provided'),
  query('year')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Year should be provided'),
  validateRequest,
  getTimesheetForProjectAndEmployee,
);
/**
 * @swagger
 * /api/v2/timesheet/employee:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetch all timesheet data for a employee
 *
 *     description: Fetch all timesheet data for a employee
 *     parameters:
 *      - in: query
 *        name: employeeId
 *        schema:
 *          type: string
 *          example: 5ff740287cf66c42cc7f852c
 *        required: true
 *        description: The mongodb ID of the employee
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *
 *     responses:
 *       '200':
 *         description: Data of all timesheet for the project
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                id:
 *                  type: string
 *                  description: empId-weekNumber-year-Version
 *                weekNumber:
 *                  type: number
 *                year:
 *                  type: string
 *                projectId:
 *                  type: string
 *                employeeId:
 *                  type: string
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      suggestion:
 *                        type: string
 *                      status:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                      tasks:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            taskName:
 *                              type: string
 *                            weekData:
 *                              type: object
 *                              properties:
 *                                Sun:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Mon:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Tue:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Wed:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Thu:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Fri:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 *                                Sat:
 *                                  type: object
 *                                  properties:
 *                                    hrs:
 *                                      type: number
 *                                    day:
 *                                      type: string
 *                                    date:
 *                                      type: string
 *                                      format: date
 *                                    active:
 *                                      type: number
 *                                    comments:
 *                                      type: string
 */
router.get(
  '/employee',
  query('employeeId')
    .exists()
    .isMongoId()
    .withMessage('Employee Id should be provided'),
  query('weekNumber')
    .exists()
    .isNumeric()
    .withMessage('Week Number should be provided'),
  query('year')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Year should be provided'),
  validateRequest,
  getAllTimesheetsForEmployee,
);

/**
 * @swagger
 * /api/v2/timesheet/pm/{timesheetId}:
 *
 *   put:
 *     tags:
 *     - "Timesheet"
 *     summary: Update status of a timesheet
 *
 *     description: Update status of a timesheet
 *     parameters:
 *      - in: path
 *        name: timesheetId
 *        schema:
 *          type: string
 *          example: 602cdf971268fb02a0658fc2
 *        required: true
 *        description: The mongodb ID of the timesheet
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                suggestion:
 *                  type: string
 *                action:
 *                  type: string
 *                  example: appr
 *                  description: Send only appr amd or adj
 *     responses:
 *       '200':
 *         description: Timesheet has been updated
 *       '400':
 *         description: Data has missing or invalid fields
 */
router.put(
  '/pm/:timesheetId',
  param('timesheetId').exists().isMongoId(),
  validateRequest,
  updateTimesheet,
);

/**
 * @swagger
 * /api/v2/timesheet/employee/{timesheetId}:
 *
 *   put:
 *     tags:
 *     - "Timesheet"
 *     summary: Update a timesheet
 *
 *     description: Update a timesheet, we have taken just one field but you can send more inputs for update
 *     parameters:
 *      - in: path
 *        name: timesheetId
 *        schema:
 *          type: string
 *          example: 602cdf971268fb02a0658fc2
 *        required: true
 *        description: The mongodb ID of the timesheet
 *
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                tasks:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      taskName:
 *                        type: string
 *                      weekData:
 *                        type: object
 *                        properties:
 *                          Sun:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Mon:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Tue:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Wed:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Thu:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Fri:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                          Sat:
 *                            type: object
 *                            properties:
 *                              hrs:
 *                                type: number
 *                              day:
 *                                type: string
 *                              date:
 *                                type: string
 *                                format: date
 *                              active:
 *                                type: number
 *                              comments:
 *                                type: string
 *                weekNumber:
 *                  type: number
 *                year:
 *                  type: string
 *
 *
 *     responses:
 *       '200':
 *         description: Timesheet has been updated
 */
router.put(
  '/employee/:timesheetId',
  param('timesheetId')
    .exists()
    .isMongoId()
    .withMessage('Timesheet id should be provided'),
  body('tasks').exists().isArray().withMessage('Tasks data should be provided'),
  body('tasks.*.weekData').exists().withMessage('Week data should be provided'),
  body('tasks.*.taskName').exists().withMessage('Task Id should be provided'),
  body('weekNumber')
    .exists()
    .isInt()
    .withMessage('Week Number should be provided'),
  body('year')
    .exists()
    .isString()
    .notEmpty()
    .withMessage('Year should be provided'),
  validateRequest,
  updateTimesheetData,
);

/**
 * @swagger
 * /api/v2/timesheet/approval:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Runs every tuesday to approve timesheets
 *
 *     description: Runs every tuesday to approve timesheets
 *     responses:
 *       '200':
 *         description: Timesheets has been updated
 */
router.get('/approval', updateStatusToApproval);

/**
 * @swagger
 * /api/v2/timesheet/posted:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Runs every Month on 5th to change status of timesheets
 *
 *     description: Runs every Month on 5th to change status of timesheets
 *     responses:
 *       '200':
 *         description: Timesheets has been updated
 */
router.get('/posted', updateStatusToPosted);

/**
 * @swagger
 * /api/v2/timesheet/month/profile:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetched timesheet based on profileId
 *
 *     description: Fetched timesheet based on profileId
 *     parameters:
 *      - in: query
 *        name: profileId
 *        schema:
 *          type: string
 *          example: 5fc48a8911452044ce34b356
 *        required: true
 *        description: The mongodb ID of the profile
 *      - in: query
 *        name: month
 *        schema:
 *          type: number
 *        required: true
 *        description: It ranges from 0-11, 0 being Jan and 11 being Dec
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        name: tStatus
 *        schema:
 *          type: string
 *        required: true
 *        description: Send status in form of APPROVED, REJECTED, SUBMITTED, MONTH_END, POSTED
 *
 *     responses:
 *       '200':
 *         description: Timesheets has been fetched
 */
router.get(
  '/month/profile',
  query('profileId').exists().isMongoId(),
  query('month').exists().isNumeric(),
  query('year').exists().isString(),
  query('tStatus').exists().isString(),
  validateRequest,
  getTimesheetForProfile,
);

/**
 * @swagger
 * /api/v2/timesheet/week/profile:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetched timesheet based on profileId
 *
 *     description: Fetched timesheet based on profileId
 *     parameters:
 *      - in: query
 *        name: profileId
 *        schema:
 *          type: string
 *          example: 5fc48a8911452044ce34b356
 *        required: true
 *        description: The mongodb ID of the profile
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        name: tStatus
 *        schema:
 *          type: string
 *        required: true
 *        description: Send status in form of APPROVED, REJECTED, SUBMITTED, POSTED
 *
 *     responses:
 *       '200':
 *         description: Timesheets has been fetched
 */
router.get(
  '/week/profile',
  query('profileId').exists().isMongoId(),
  query('weekNumber').exists().isNumeric(),
  query('year').exists().isString(),
  query('tStatus').exists().isString(),
  validateRequest,
  getTimesheetForProfileForWeek,
);

/**
 * @swagger
 * /api/v2/timesheet/gen-pdf:
 *
 *   post:
 *     tags:
 *     - "Timesheet"
 *     summary: Generate pdf for timesheet
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                timesheetArr:
 *                  type: array
 *                  items:
 *                    type: string
 *
 *     description: Generate pdf for timesheet
 *     responses:
 *       '200':
 *         description: Timesheets pdf generated
 */

router.post(
  '/gen-pdf',
  body('timesheetArr').isArray(),
  validateRequest,
  generatePdf,
);

/**
 * @swagger
 * /api/v2/timesheet/pm/get-count:
 *
 *   post:
 *     tags:
 *     - "Timesheet"
 *     summary: Get the count of documents with given status for all project IDs
 *
 *     description: Get the count of documents with given status for all project IDs
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                projectArr:
 *                  type: array
 *                  items:
 *                    type: string
 *                tStatus:
 *                  type: string
 *                  description: send only SUBMITTED, APPROVED, REJECTED, POSTED
 *     responses:
 *       '200':
 *         description: Timesheet count fetched
 */
router.post('/pm/get-count', getCountForProject);

/**
 * @swagger
 * /api/v2/timesheet/emp/get-count:
 *
 *   post:
 *     tags:
 *     - "Timesheet"
 *     summary: Get the count of documents with given status for all employee IDs
 *
 *     description: Get the count of documents with given status for all employee IDs
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                employeeArr:
 *                  type: array
 *                  items:
 *                    type: string
 *                tStatus:
 *                  type: string
 *                  description: send only SUBMITTED, APPROVED, REJECTED, POSTED
 *     responses:
 *       '200':
 *         description: Timesheet count fetched
 */
router.post('/emp/get-count', getCountForEmployee);

/**
 * @swagger
 * /api/v2/timesheet/vendor:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Fetched timesheet based on vendorId
 *
 *     description: Fetched timesheet based on vendorId
 *     parameters:
 *      - in: query
 *        name: vendorId
 *        schema:
 *          type: string
 *          example: 5f8972eae5daed54edb656e2
 *        required: true
 *        description: The mongodb ID of the profile
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *
 *     responses:
 *       '200':
 *         description: Timesheets has been fetched
 */
router.get(
  '/vendor',
  query('vendorId')
    .exists()
    .isMongoId()
    .withMessage('provide a valid vendor Id'),
  query('weekNumber').exists(),
  query('year').exists(),
  validateRequest,
  getTimesheetsForVendor,
);

/**
 * @swagger
 * /api/v2/timesheet/invoice-data:
 *
 *   get:
 *     tags:
 *     - "Timesheet"
 *     summary: Get invoice data for vendors
 *
 *     description: get Invoice data for vendors
 *     responses:
 *       '200':
 *         description: Invoice data fetched
 *
 */
router.get('/invoice-data', getInvoiceData);

export default router;
