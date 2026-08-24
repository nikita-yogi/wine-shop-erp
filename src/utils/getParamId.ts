// src/utils/getParamId.ts
import type { Request } from "express";

export const getParamId = (req: Request): string => {
  return req.params.id as string;
};