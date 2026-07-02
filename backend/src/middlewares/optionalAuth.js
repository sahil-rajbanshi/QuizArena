import jwt from 'jsonwebtoken';
import config from '../config/env.js';

// Like auth.js, but never blocks the request. If a valid Bearer token is
// present, req.user is populated (same shape as the strict `auth` middleware).
// If it's missing, malformed, or expired, req.user stays undefined and the
// request proceeds as anonymous. Used on routes that are public but need to
// render differently for admins (e.g. hiding is_correct from quiz-takers
// while still showing it to admins editing questions).
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, config.jwtAccessSecret);
    } catch (error) {
      // Invalid/expired token on an optional route — ignore and continue anonymous.
    }
  }
  next();
};

export default optionalAuth;