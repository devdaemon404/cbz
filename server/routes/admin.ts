import express from 'express';
const router = express.Router();

import { sendOnboardingUrl } from '../controllers/admin';

/**
 * @swagger
 * tags:
 *  name: "onboarding"
 *  description: "Onboarding routes"
 */

/**
 * @swagger
 * /api/v2/admin/onboarding-url:
 *
 *   post:
 *     tags:
 *     - "onboarding"
 *
 *     summary: Send Onboarding Url to the given user
 *
 *     description: Send Onboarding Url to the given user
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                profileId:
 *                  type: string
 *                  description: ProfileId of the user
 *                  example: "5f8980d1e5daed54edb656f1"
 *     responses:
 *       '200':
 *         description: Onboarding Email Sent
 *       '404':
 *         description: Profile with given id  not found
 *
 */

router.post('/onboarding-url', sendOnboardingUrl);

export default router;
