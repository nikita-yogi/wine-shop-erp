import type { Request, Response, NextFunction } from "express";
import {verifyAccessToken} from "../utils/jwt.js";


export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access token missing",
      });
    }

    const decoded = verifyAccessToken(token); //token ko secret key se verify karo

       if (typeof decoded === "string") {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    req.user = decoded;
 

    next();
  } catch (error: any) {
    //jwt.verify() fail hua
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired, please login again",
      });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
