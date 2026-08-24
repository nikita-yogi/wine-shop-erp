import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType, source: "body" | "params" = "body") => {

  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) { 
      return next(result.error);
    }

      req[source] = result.data;

    next();
  };
};





   