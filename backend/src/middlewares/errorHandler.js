import logger from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(err.stack);

  const responsePayload = {
    success: false,
    error: message,
    code: statusCode,
  };

  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandler;
