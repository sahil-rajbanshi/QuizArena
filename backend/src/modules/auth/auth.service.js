import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/env.js';
import { query } from '../../config/db.js';

// Helper to extract user without password_hash
const sanitizeUser = (user) => {
  const { password_hash, ...rest } = user;
  return rest;
};

// Register user
export const registerUser = async (name, email, password) => {
  // Check if email already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const rounds = config.bcryptRounds || 10;
  const passwordHash = await bcrypt.hash(password, rounds);

  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash]
  );

  return sanitizeUser(result.rows[0]);
};

// Login user
export const loginUser = async (email, password) => {
  // Find user
  const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const user = userResult.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Generate tokens
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpires || '15m',
  });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpires || '7d',
  });

  // Store refresh token in database
  await query(
    `INSERT INTO refresh_tokens (id, user_id, token)
     VALUES ($1, $2, $3)`,
    [uuidv4(), user.id, refreshToken]
  );

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);

    // Check if token exists in database
    const tokenResult = await query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
    if (tokenResult.rows.length === 0) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }

    // Get user to include role in new token
    const userResult = await query('SELECT id, email, role FROM users WHERE id = $1', [
      tokenResult.rows[0].user_id,
    ]);
    if (userResult.rows.length === 0) {
      const err = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }

    const user = userResult.rows[0];
    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpires || '15m',
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }
    throw error;
  }
};

// Logout user - delete refresh token
export const logoutUser = async (refreshToken) => {
  const result = await query('DELETE FROM refresh_tokens WHERE token = $1 RETURNING id', [
    refreshToken,
  ]);
  if (result.rows.length === 0) {
    const err = new Error('Refresh token not found');
    err.statusCode = 404;
    throw err;
  }
  return { success: true };
};