import express from 'express';
const router = express.Router();

import {
  createOnboarding,
  getAllEmployees,
  getContactInfo,
  getOnboardingData,
  onboardingSendOtp,
} from '../controllers/employee';
import { protectOnboarding } from '../middleware/auth';

router.get('/all', getAllEmployees);

/**
 * @swagger
 * /api/v2/employee/onboarding-send-otp:
 *
 *   get:
 *     tags:
 *     - "onboarding"
 *
 *     summary: Send OTP to verify the identity
 *
 *     description: Send OTP to verify the identity
 *
 *     parameters:
 *       - name: x-onboarding-token
 *         in: header
 *         description: Onboarding Token
 *         required: true
 *         type: string
 *
 *     responses:
 *       '200':
 *         description: OTP sent to your email
 *
 */

router.get('/onboarding-send-otp', protectOnboarding, onboardingSendOtp);

/**
 * @swagger
 * /api/v2/employee/profile/{profileId}:
 *
 *   get:
 *     tags:
 *     - "onboarding"
 *
 *     summary: Get onboarding data for profile
 *
 *     description: Get onboarding data for employee
 *
 *     parameters:
 *       - in: path
 *         name: profileId
 *         schema:
 *           type: string
 *           example: 60521c9f9384e371aa6d0f54
 *         required: true
 *
 *     responses:
 *       '200':
 *         description: Fetched onboarding data
 *
 */

router.get('/profile/:profileId', getOnboardingData);

/**
 * @swagger
 * /api/v2/employee/onboarding:
 *
 *   post:
 *     tags:
 *     - "onboarding"
 *
 *     summary: Create/Update Onboarding Info
 *
 *     description: Create/Update Onboarding Info
 *
 *     parameters:
 *       - name: x-onboarding-token
 *         in: header
 *         description: Onboarding Token
 *         required: true
 *         type: string
 *
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                otp:
 *                  type: string
 *                  description: OTP sent to your email
 *                  example: "random-6-digit"
 *                onboardingData:
 *                  type: object
 *                  description: Any key value pairs
 *                  properties:
 *                    anyThing:
 *                      type: string
 *                      example: "anyThing"
 *
 *     responses:
 *       '200':
 *         description: Created/Updated Onboarding Info
 *
 */

router.post('/onboarding', protectOnboarding, createOnboarding);

router.get('/contact-info', protectOnboarding, getContactInfo);

export default router;
