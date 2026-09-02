import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType, source: "body" | "params" = "body") => {

  return (req: Request, res: Response, next: NextFunction) => { 
    // console.log("result", req.params);
    // console.log("result source", req[source]);
    const result = schema.safeParse( req[source]);
    if (!result.success) { 
      // return next(result.error);
        return res.status(400).json({
        success: false,
        errors: result.error.issues
      });
    }

      req[source] = result.data;

    next();
  };
};





   