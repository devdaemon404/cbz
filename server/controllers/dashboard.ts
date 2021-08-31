import { Request, Response } from 'express';
import asyncHandler from '../middleware/async';

const basePath = 'https://test.app.cloudsbuzz.in';

export const clientAdminApi = asyncHandler(
  async (req: Request, res: Response) => {
    const { clientId } = req.params;

    try {
      const totalContr = await fetch(
        `${basePath}/apis/v1/stats/contractors?client_id=${clientId}`,
      ).then((res) => res.json());

      const totalDemands = await fetch(
        `${basePath}/apis/v1/stats/client/demands?client_id=${clientId}`,
      ).then((res) => res.json());

      const totalVendor = await fetch(
        `${basePath}/apis/v1/stats/vendors?client_id=${clientId}`,
      ).then((res) => res.json());

      const totalEmp = await fetch(
        `${basePath}/apis/v1/stats/employees?client_id=${clientId}`,
      ).then((res) => res.json());

      const profileReview = await fetch(
        `${basePath}/apis/v1/stats/client/profiles?client_id=${clientId}&status=READY_TO_SHARE`,
      ).then((res) => res.json());

      const intSched = await fetch(
        `${basePath}/apis/v1/stats/client/profiles?client_id=${clientId}&status=INTERVIEW_IN_PROCESS`,
      ).then((res) => res.json());

      res.status(200).json({
        success: true,
        totalContr,
        totalDemands,
        totalVendor,
        totalEmp,
        profileReview,
        intSched,
      });
    } catch (error) {
      throw error;
    }
  },
);

export const projectManagerApi = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const totalCont = await fetch(
        `${basePath}/apis/v1/stats/project/manager/contractors?user_id=${userId}`,
      ).then((res) => res.json());

      const intSched = await fetch(
        `${basePath}/apis/v1/stats/project/manager/profiles?user_id=${userId}&status=INTERVIEW_IN_PROCESS`,
      ).then((res) => res.json());

      const profReview = await fetch(
        `${basePath}/apis/v1/stats/project/manager/profiles?user_id=${userId}&status=EVALUATION_IN_PROGRESS,JOB_SEEKER_INTERESTED`,
      ).then((res) => res.json());

      const totalDemands = await fetch(
        `${basePath}/apis/v1/stats/manager/demands?user_id=${userId}`,
      ).then((res) => res.json());

      res.status(200).json({
        success: true,
        totalCont,
        intSched,
        profReview,
        totalDemands,
      });
    } catch (error) {
      throw error;
    }
  },
);

export const vendorAdminApi = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;

      const totalCont = await fetch(
        `${basePath}/apis/v1/stats/contractors?vendor_id=${vendorId}`,
      ).then((res) => res.json());

      const totalDemands = await fetch(
        `${basePath}/apis/v1/stats/vendor/demands?vendor_id=${vendorId}`,
      ).then((res) => res.json());

      res.status(200).json({
        success: false,
        totalCont,
        totalDemands,
      });
    } catch (error) {
      throw error;
    }
  },
);

export const recuriterApi = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const totalDemands = await fetch(
        `${basePath}/apis/v1/stats/recruiter/demands?user_id=${userId}`,
      ).then((res) => res.json());

      const totalOnb = await fetch(
        `${basePath}/apis/v1/stats/recruiter/demands?user_id=${userId}`,
      ).then((res) => res.json());

      const intSched = await fetch(
        `${basePath}/apis/v1/stats/recruiter/interview-schedules?user_id=${userId}`,
      ).then((res) => res.json());

      res.status(200).json({
        success: true,
        totalDemands,
        totalOnb,
        intSched,
      });
    } catch (error) {
      throw error;
    }
  },
);
