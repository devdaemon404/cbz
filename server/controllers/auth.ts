import fetch from 'node-fetch';
import cookie from 'cookie';

import asyncHandler from '../middleware/async';

/**
 * @desc   Authenticate from v1 api
 * @route  POST /api/v2/auth/v1-login
 * @access Public
 *
 */
export const v1Login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const resp1 = await fetch(
    `https://test.app.cloudsbuzz.in/apis/v1/authenticate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );

  const v1Cookie = cookie.parse(resp1.headers.get('set-cookie'));
  console.log(v1Cookie);

  const options = {
    expires: new Date(v1Cookie.Expires),
    maxAge: v1Cookie['Max-Age'],
    httpOnly: true,
    domain: 'cloudsbuzz.in',
    sameSite: 'None',
    secure: true,
  };

  res
    .status(200)
    .cookie('access_token', v1Cookie.access_token, options)
    .json({
      success: true,
      message: 'Token generated from v1',
      data: {
        token: v1Cookie.access_token,
      },
    });
});

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 * @access Public
 *
 */
export const login = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Test route. New',
    data: {
      columnCount: 100,
    },
  });
});

export const userInfo = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Fetched user info',
    data: {
      userName: 'Ramesh',
    },
  });
});
