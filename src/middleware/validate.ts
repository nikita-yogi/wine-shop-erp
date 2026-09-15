import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType, source: "body" | "params"|"query" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => { 
    const result = schema.safeParse( req[source]);
    if (!result.success) { 
      // return next(result.error);
        return res.status(400).json({
        success: false,
        errors: result.error.issues
      });
    }

    if (source === "query") {
      res.locals.query = result.data;
    } else {
      req[source] = result.data;
    }

    next();
  };
};





   