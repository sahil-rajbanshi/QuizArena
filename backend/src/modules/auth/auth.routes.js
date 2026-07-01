import express from 'express';
import { z } from 'zod';
import asyncHandler from '../../utils/asyncHandler.js';
import auth from '../../middlewares/auth.js';
import {
  register,
  login,
  refresh,
  logout,
} from './auth.controller.js';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const err = new Error(error.errors?.[0]?.message || 'Validation error');
    err.statusCode = 400;
    next(err);
  }
};

// Routes
router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', auth, asyncHandler(logout));

export default router;