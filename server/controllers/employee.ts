import asyncHandler from '../middleware/async';
import sendEmail from '../utils/sendEmail';
import ErrorResponse from '../utils/errorResponse';

import Profile from '../models/Profile';

/**
 * @desc   Create Onboarding Info
 * @route  POST /api/v2/employee/onboarding
 * @access Public
 *
 */
export const createOnboarding = asyncHandler(async (req, res, next) => {
  const { otp, onboardingData } = req.body;

  if (
    req.profile.onboardingOtp.otp !== otp ||
    req.profile.onboardingOtp.expiry < Date.now()
  ) {
    return next(new ErrorResponse(`OTP expired or invalid`, 401));
  }

  await Profile.findByIdAndUpdate(
    req.profile._id,
    {
      onboardingData,
      onboardingToken: undefined
    },
    {
      runValidators: true
    }
  );

  res.status(201).json({
    success: true,
    message: 'Created/Updated Onboarding Info'
  });
});

/**
 * @desc   Send OTP to verify the identity
 * @route  POST /api/v2/employee/onboarding-send-otp
 * @access Public
 *
 */

export const onboardingSendOtp = asyncHandler(async (req, res, next) => {
  const otp = Math.floor(Math.random() * 899999 + 100000);
  const message = `You are receiving this email to verify the otp: ${otp},This otp expires in 10 minutes`;
  const otpExpire = Date.now() + 10 * 60 * 1000;

  await Profile.findByIdAndUpdate(req.profile?._id, {
    onboardingOtp: {
      otp,
      expiry: otpExpire
    }
  });

  await sendEmail({
    email: req.profile?.email,
    subject: 'Onboarding OTP Verification',
    html: message
  });

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email'
  });
});

/**
 * @desc   Get Contact Information
 * @route  GET /api/v2/employee/contact-info
 * @access Public
 *
 */

export const getContactInfo = asyncHandler(async (req, res, next) => {
  const contactInfo = {
    fullName: `${req.profile.firstname} ${req.profile.lastname}`,
    emailAddress: req.profile.email,
    permanentAddress: req.profile.location,
    phoneNumber: req.profile.mobile
  };
  res.status(200).json({
    success: true,
    message: 'Contact Info',
    data: contactInfo
  });
});

/**
 * @desc Get employees Onboarding Data
 * @route GET /ap/v2/employee/profile/{profileId}
 * @access Public
 */
export const getOnboardingData = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;

  let onboardingData = await Profile.findById(
    profileId,
    'onboardingData'
  ).lean();
  if (onboardingData) {
    if (Object.keys(onboardingData).length === 1) onboardingData = null;
  } else onboardingData = null;
  res.status(200).json({
    success: true,
    message: 'Onboarding data fetched',
    onboardingData
  });
});

/**
 * @desc   Get All Employees
 * @route  GET /api/v2/employee/all
 * @access Public
 *
 */

/**
 * This is a temporary route for testing purpose which has static data of employees
 *
 */

export const getAllEmployees = asyncHandler(async (req, res, next) => {
  const mockEmployees = [
    {
      id: 'emp-001',
      name: 'alpha'
    },
    {
      id: 'emp-002',
      name: 'beta'
    },
    {
      id: 'emp-003',
      name: 'charlie'
    }
  ];
  res.status(200).json({
    success: true,
    message: 'Fake employee data',
    data: {
      mockEmployees
    }
  });
});
