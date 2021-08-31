import express from 'express';
const router = express.Router();

import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

import {
  createTask,
  getTaskForProject,
  getTasksForWeek,
  updateTask,
} from '../controllers/task';

/**
 * @swagger
 * tags:
 *  name: "Task"
 *  description: "Task routes"
 */

/**
 * @swagger
 * /api/v2/task:
 *
 *   post:
 *     tags:
 *     - "Task"
 *     summary: Create a task document
 *
 *     description: Create a task document for a project
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
 *                      startDate:
 *                        type: string
 *                        format: date
 *                      endDate:
 *                        type: string
 *                        format: date
 *                      taskName:
 *                        type: string
 *                      taskDesc:
 *                        type: string
 *                      startWeek:
 *                        type: number
 *                      endWeek:
 *                        type: number
 *                      year:
 *                        type: string
 *                      projectId:
 *                        type: string
 *                        example: 5fed744c2187ce7aae6cd86b
 *
 *
 *
 *     responses:
 *       '200':
 *         description: Task has been created
 *       '400':
 *         description: There are missing fields in the request body or data provided is not correct
 *
 */
router.post(
  '/',
  body('tasks.*.taskName')
    .isString()
    .notEmpty()
    .withMessage('Task name should be provided'),
  body('tasks.*.startDate')
    .isString()
    .notEmpty()
    .withMessage('Start Date should be provided'),
  body('tasks.*.endDate')
    .isString()
    .notEmpty()
    .withMessage('End Date should be provided'),
  body('tasks.*.taskDesc')
    .isString()
    .notEmpty()
    .withMessage('Task description should be provided'),
  body('tasks.*.startWeek')
    .isNumeric()
    .withMessage('Start week should be provided'),
  body('tasks.*.endWeek')
    .isNumeric()
    .withMessage('End week should be provided'),
  body('tasks.*.year')
    .isString()
    .notEmpty()
    .withMessage('year should  be provided'),
  body('tasks.*.projectId')
    .isMongoId()
    .withMessage('Project Id should be provided'),
  validateRequest,
  createTask,
);

/**
 * @swagger
 * /api/v2/task/{projectId}:
 *
 *   get:
 *     tags:
 *     - "Task"
 *     summary: Get all tasks for a project
 *
 *     description: Get all tasks for a project
 *
 *     parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *          example: 5fed744c2187ce7aae6cd86b
 *        required: true
 *        description: The mongodb ID of the project
 *
 *     responses:
 *       '200':
 *         description: Data of all tasks
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  success:
 *                      type: boolean
 *                  message:
 *                      type: string
 *                  taskData:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          _id:
 *                              type: string
 *                          startDate:
 *                            type: string
 *                            format: date
 *                          endDate:
 *                            type: string
 *                            format: date
 *                          taskName:
 *                            type: string
 *                          taskDesc:
 *                            type: string
 *                          startWeek:
 *                            type: number
 *                          endWeek:
 *                            type: number
 *                          year:
 *                            type: string
 *                          projectId:
 *                            type: string
 *                            example: 5fed744c2187ce7aae6cd86b
 */
router.get(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Project Id should be specified'),
  validateRequest,
  getTaskForProject,
);

/**
 * @swagger
 * /api/v2/task/{taskId}:
 *
 *   put:
 *     tags:
 *     - "Task"
 *     summary: Update a task
 *
 *     description: Update a task we have taken just one field but you can send more inputs for update
 *     parameters:
 *      - in: path
 *        name: taskId
 *        schema:
 *          type: string
 *          example: 6019a48d44cc180ad3a4caf5
 *        required: true
 *        description: The mongodb ID of the project
 *
 *     requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  taskName:
 *                      type: string
 *
 *
 *
 *     responses:
 *       '200':
 *         description: Task has been updated
 */
router.put(
  '/:taskId',
  param('taskId').isMongoId().withMessage('Task Id should be provide'),
  validateRequest,
  updateTask,
);

/**
 * @swagger
 * /api/v2/task:
 *
 *   get:
 *     tags:
 *     - "Task"
 *     summary: Get all tasks for a project and a week
 *
 *     description: Get all tasks for a project and a week
 *     parameters:
 *      - in: query
 *        name: weekNumber
 *        schema:
 *          type: number
 *        required: true
 *      - in: query
 *        name: projectId
 *        schema:
 *          type: string
 *          example: 5fed744c2187ce7aae6cd86b
 *        required: true
 *      - in: query
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *
 *     responses:
 *       '200':
 *         description: Data of all tasks
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  success:
 *                      type: boolean
 *                  message:
 *                      type: string
 *                  taskData:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          _id:
 *                              type: string
 *                          startDate:
 *                            type: string
 *                            format: date
 *                          endDate:
 *                            type: string
 *                            format: date
 *                          taskName:
 *                            type: string
 *                          taskDesc:
 *                            type: string
 *                          startWeek:
 *                            type: number
 *                          endWeek:
 *                            type: number
 *                          year:
 *                            type: string
 *                          projectId:
 *                            type: string
 *                            example: 5fed744c2187ce7aae6cd86b
 */
router.get(
  '/',
  query('projectId').exists().isMongoId(),
  query('weekNumber').isNumeric().exists(),
  query('year').exists().isString().notEmpty(),
  validateRequest,
  getTasksForWeek,
);
export default router;
