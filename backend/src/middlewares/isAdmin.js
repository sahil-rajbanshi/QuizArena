import { errorResponse } from '../utils/apiResponse.js';

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 'Access denied', 403);
};

export default isAdmin;