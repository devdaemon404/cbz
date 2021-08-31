import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';

import Profile from '../models/Profile';
import crypto from 'crypto';

/**
 * @desc   Send Onboarding Url to the given user
 * @route  POST /api/v2/admin/onboarding-url
 * @access Private Role = admin
 *
 */
export const sendOnboardingUrl = asyncHandler(async (req, res, next) => {
  const { profileId } = req.body;

  let profile = await Profile.findById(profileId);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile with id ${profileId} not found`, 404)
    );
  }
  const onboardingToken = crypto.randomBytes(20).toString('hex');

  // Set expiry for the token
  const onboardingUrlExpire = Date.now() + 100 * 60 * 1000;

  profile = await Profile.findByIdAndUpdate(
    profile._id,
    {
      onboardingToken: {
        token: onboardingToken,
        expiry: onboardingUrlExpire,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const onboardingUrl = `${req.protocol}://${req.get(
    'host'
  )}/app/employee/onboarding/${onboardingToken}`;

  const message = `<pre>You are receiving this email for the <a href='${onboardingUrl}'>Onboarding Link:</a></pre>`;

  await sendEmail({
    email: profile.email,
    subject: 'Onboarding Link',
    html: message,
  });

  res.status(200).json({
    success: true,
    message: 'Onboarding Email Sent',
    data: {
      token: profile.onboardingToken.token,
    },
  });
});
