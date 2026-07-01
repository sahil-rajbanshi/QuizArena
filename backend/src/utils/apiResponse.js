export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode,
  });
};