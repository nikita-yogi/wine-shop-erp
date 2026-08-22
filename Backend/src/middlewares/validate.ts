import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body || req.params);

    if (!result.success) {  `1`
      return next(result.error);
    }

    req.body = result.data;

    next();
  };
};
