import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../types/express.js";


const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, accessSecret, {
    // expiresIn: "15m",
    expiresIn: "7d",
  });
};

export const generateRefreshToken = (payload: JwtUserPayload) => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });
};


//Verify funcation for token
export const verifyAccessToken = (token:string): JwtUserPayload=>{
  return jwt.verify(token,accessSecret) as JwtUserPayload ;
}

export const verifyRefreshToken = (token:string): JwtUserPayload=>{
  return jwt.verify(token,refreshSecret) as JwtUserPayload;
}