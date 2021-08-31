import asyncHandler from '../middleware/async';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

import Employees from '../models/Employees';
import Vendor from '../models/Vendor';
import Client from '../models/Client';
import Profile from '../models/Profile';
import Invoice from '../models/Invoice';

import { AwsS3 } from '../utils/awsS3';
import sendEmail from '../utils/sendEmail';

/**
 * @desc   Get a work order
 * @route  GET /api/v2/vendor/employees
 * @access Private
 *
 */
export const getAllVendorsWithEmployees = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employees = await Employees.find({}).lean();
    const employeeProfiles = await Profile.find({}).lean();

    const vendors = {};

    // for (let employee of employees) {
    //   let vendorId = employee.vendor.oid;
    //   let profileId = employee.profile.oid;

    //   let vendor = await Vendor.findById(vendorId).lean();
    //   let clientId = vendor.client.oid;

    //   let client = await Client.findById(clientId).lean();
    //   employee.profileId = profileId;
    //   if (vendorId in vendors) {
    //     vendors[vendorId]['employees'].push(employee);
    //   } else {
    //     vendors[vendorId] = {
    //       ...vendor,
    //       client,
    //       employees: [employee],
    //     };
    //   }
    // }

    for (let employee of employeeProfiles) {
      let vendorId = employee?.vendor?.oid;

      if (vendorId) {
        let profileId = employee._id;

        let vendor = await Vendor.findById(vendorId).lean();
        let clientId = vendor.client.oid;

        let client = await Client.findById(clientId).lean();
        employee.profileId = profileId;
        if (vendorId in vendors) {
          vendors[vendorId]['employees'].push(employee);
        } else {
          vendors[vendorId] = {
            ...vendor,
            client,
            employees: [employee],
          };
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Vendors with their employee list',
      data: vendors,
    });
  },
);

/**
 * @desc   Get a work order
 * @route  GET /api/v2/vendor/sendEmail
 * @access Private
 *
 */
export const sendEmailToClientAndVendor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      clientEmail,
      vendorEmail,
      vendorId,
      clientId,
      fileKey,
      invoiceNumber,
    } = req.body;

    const filename = path.basename(fileKey);

    // await Vendor.findByIdAndUpdate(vendorId, {
    //   $push: {
    //     invoiceDocuments: fileKey,
    //   },
    // });

    await Invoice.create({
      clientId,
      vendorId,
      fileKey,
      invoiceNumber: Number(invoiceNumber),
    });

    const params = {
      Bucket: 'employee-op-bucket-777',
      Expires: 60 * 60,
      Key: `${fileKey}`,
    };

    const s3GetUrl = await new AwsS3().getSignedUrl('getObject', params);

    let html = `<p>Hi ${vendorEmail} Vendor, Please find the attachment for this month's invoice</p>`;

    await sendEmail({
      email: vendorEmail,
      subject: 'Invoice',
      html,
      attachments: [
        {
          // use URL as an attachment
          filename,
          path: s3GetUrl,
        },
      ],
    });

    html = `<p>Hi ${clientEmail} Client, Please find the attachment for this month's invoice</p>`;

    await sendEmail({
      email: clientEmail,
      subject: 'Invoice',
      html,
      attachments: [
        {
          // use URL as an attachment
          filename,
          path: s3GetUrl,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Email Sent both for client and vendor',
    });
  },
);
