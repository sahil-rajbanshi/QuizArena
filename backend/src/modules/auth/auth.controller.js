import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  return successResponse(res, user, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  // Set refresh token in httpOnly cookie
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return successResponse(res, { user, accessToken }, 'Login successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    const err = new Error('Refresh token not provided');
    err.statusCode = 401;
    throw err;
  }

  const { accessToken } = await refreshAccessToken(refreshToken);
  return successResponse(res, { accessToken }, 'Access token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await logoutUser(refreshToken);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  return successResponse(res, null, 'Logged out successfully');
});