import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/User';
import Profile from '../models/Profile';

import jwksClient from 'jwks-rsa';

const client = jwksClient({
  strictSsl: true, // Default value
  jwksUri: 'https://test.app.cloudsbuzz.in/.well-known/jwks',
});

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    // Set token from Bearer token in header
    token = req.headers.authorization;
    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);

    if (user.active !== 1) {
      return next(
        new ErrorResponse("User's account is active or relieved", 401),
      );
    }

    if (user.isDeleted) {
      return next(new ErrorResponse("User's account not active", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

export const protectOnboarding = async (req, res, next) => {
  let token = req.headers['x-onboarding-token'];

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    let profile = await Profile.findOne({
      $and: [
        { 'onboardingToken.token': token },
        { 'onboardingToken.expiry': { $gt: Date.now() } },
      ],
    });

    if (!profile) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401),
      );
    }
    req.profile = profile;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

export const authenticateFromV1Api = async (req, res, next) => {
  let token: string | undefined;

  if (req.cookies['access_token']) {
    token = req.cookies['access_token'];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const kid = 'default-key-id';

    const key = await client.getSigningKeyAsync(kid);
    const signingKey = key.getPublicKey();

    const decoded = jwt.verify(token, signingKey);

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};

// Grant access to specific roles
export const authorizeFromV1Api = (...roles) => {
  //req.user.scope is same as role but is defined in v1 api
  return (req, res, next) => {
    const [role] = req.user.scope;
    if (!roles.includes(role)) {
      return next(
        new ErrorResponse(
          `User role ${role} is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};
