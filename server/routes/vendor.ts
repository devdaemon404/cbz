import express from 'express';

const router = express.Router();

import {
  getAllVendorsWithEmployees,
  sendEmailToClientAndVendor,
} from '../controllers/vendor';

/**
 * @swagger
 * tags:
 *  name: "vendors"
 *  description: "Vendor routes"
 */

router.route('/employees').get(getAllVendorsWithEmployees);
router.route('/sendEmail').post(sendEmailToClientAndVendor);

export default router;
