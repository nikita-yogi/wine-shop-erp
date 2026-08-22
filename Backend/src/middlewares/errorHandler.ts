import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { errors: err.details }),
  });
};