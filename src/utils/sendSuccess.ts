import type { Response } from "express";

export const sendSuccess = (res: Response, statusCode: number, data: unknown, meta?: object) => {
  return res.status(statusCode).json({ success: true, data, ...(meta && { meta }) });
};