import "express";

export interface JwtUserPayload {
   userUuid:string;
  userId: number;
  roleId: number | null;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export {};