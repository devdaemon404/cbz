import express from 'express';

const router = express.Router();

import {
  uploadFileForOnboarding,
  getFileForEverything,
  uploadFileForWorkOrder,
} from '../controllers/file';

import {
  authenticateFromV1Api,
  authorizeFromV1Api,
  protectOnboarding,
} from '../middleware/auth';

/**
 * @swagger
 * tags:
 *  name: "file"
 *  description: "File upload and download routes"
 */

/**
 * @swagger
 * /api/v2/file/work-order/upload-url:
 *
 *   post:
 *     tags:
 *     - "file"
 *
 *     summary: Upload file to aws s3 - Work-order
 *
 *     description: Upload file to aws s3 - Work-order
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fileName:
 *                  type: string
 *                  description: File name of the uploading file.
 *                  example: "emp-workorder"
 *                fileType:
 *                  type: string
 *                  description: Filetype of the uploading file.
 *                  example: "work-order"
 *                fileExtension:
 *                  type: string
 *                  description: FileExtension.
 *                  example: "pdf"
 *
 *     responses:
 *       '200':
 *         description: Created PUT url for file upload for the given fileName
 *
 */

router
  .route('/work-order/upload-url')
  .post(
    authenticateFromV1Api,
    authorizeFromV1Api('CLIENT_ADMIN', 'PROJECT_MANAGER'),
    uploadFileForWorkOrder,
  );

/**
 * @swagger
 * /api/v2/file/work-order/get-url:
 *
 *   get:
 *     tags:
 *     - "file"
 *
 *     summary: Download file for workorder - insecure
 *
 *     description: Download file for workorder - insecure
 *
 *     parameters:
 *      - name: filePath
 *        in: query
 *        description: File path for the file
 *        required: true
 *     responses:
 *       '200':
 *         description: Created PUT url for file upload for the given fileName
 *
 */

router
  .route('/work-order/get-url')
  .get(
    authenticateFromV1Api,
    authorizeFromV1Api(
      'CLIENT_ADMIN',
      'PROJECT_MANAGER',
      'VICE_PRESIDENT',
      'VENDOR_ADMIN',
    ),
    getFileForEverything,
  );

router
  .route('/onboarding/upload-url')
  .post(protectOnboarding, uploadFileForOnboarding);
router
  .route('/onboarding/get-url')
  .get(protectOnboarding, getFileForEverything);

export default router;
