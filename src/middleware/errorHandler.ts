import type { Request, Response, NextFunction } from 'express';
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidationError = err instanceof ZodError;

  const isPrismaKnownError = err instanceof Prisma.PrismaClientKnownRequestError;
 // Prisma P2002 - Unique constraint violation
  if (isPrismaKnownError && err.code === "P2002") {
    const field = Array.isArray(err.meta?.target) ? err.meta.target[0] : "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Prisma P2025 - Record not found (update/delete pe agar record exist na kare)
  if (isPrismaKnownError && err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // Prisma P2003 - Foreign key constraint failed (jaise dependent record delete karna)
  if (isPrismaKnownError && err.code === "P2003") {
    return res.status(409).json({
      success: false,
      message: "Cannot perform this action due to related records",
    });
  }
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
