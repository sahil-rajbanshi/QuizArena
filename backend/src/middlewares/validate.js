// src/middlewares/validate.js
import { z } from 'zod';

export default function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
    const err = new Error(error.errors?.[0]?.message || 'Validation error');
      err.statusCode = 400;
      next(err);
    }
  };
}