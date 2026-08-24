import type { Request, Response, NextFunction } from 'express';
import { ZodError } from "zod";
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidationError = err instanceof ZodError;
  const statusCode = err instanceof ApiError ? err.statusCode : isValidationError ? 400 : 500;
  const message = isValidationError ? "Validation failed" : err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(isValidationError && {
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    }),
    ...(!isValidationError && err.details && { errors: err.details }),
  });
};
