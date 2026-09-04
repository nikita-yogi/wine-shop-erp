import type { Request } from "express";
import { ApiError } from "./ApiError.js";

export const getUuidParam = (req: Request): string => {
  const raw = req.params.uuid;
  const uuid = Array.isArray(raw) ? raw[0] : raw;

  if (!uuid) {
    throw new ApiError(400, "uuid param is required");
  }

  return uuid;
};