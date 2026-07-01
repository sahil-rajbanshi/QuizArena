import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtAccessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

export default auth;