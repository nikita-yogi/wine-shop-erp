import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";

import type { RegisterDTO, LoginDTO } from "../types/user.js";
import { authModel } from "../models/auth.js";
import { roleModel } from "../models/role.js";
import { assignDefaultPermissions } from "../utils/assignDefaultPermissions.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";

import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";

// Helper function to generate exactly 6-digit OTP string safely
const generate6DigitOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// =========================================================================
// FLOW 1: FORGOT PASSWORD (Bina Login Ke - Email ➔ OTP ➔ New Password)
// =========================================================================
export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  //user exits
  const user = await authModel.findUserByEmail(email);
  // 2.  CHANGE HERE: Security check - reveal nahi karna hai ki user exist karta hai ya nahi
  if (!user) {
    return sendSuccess(res, 200, "If that email exists, an OTP has been sent");
  }

  //. Check karo ki user 24-hour block me hai ya nahi (Latest record se)
  const latestOtpRecord = await authModel.findLatestOtpRecord(email);
  if (
    latestOtpRecord &&
    latestOtpRecord.blocked_until &&
    latestOtpRecord.blocked_until > new Date()
  ) {
    throw new ApiError(
      429,
      "Too many failed attempts. Please try again after 24 hours.",
    );
  }
  const otp = generate6DigitOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Current time + 15 Minutes

  //table me new record creat kregge
  await authModel.createOtpRecord({
    user_id: user.id,
    email: email,
    otp: otp,
    expires_at: expiresAt,
  });
  await sendEmail({
    to: email,
    subject: "Password Reset Verification Code",
    text: `Your 6-digit OTP code for password reset is: ${otp}. This code is valid for 15 minutes.`,
    html: `<p>Your 6-digit OTP code for password reset is: <b>${otp}</b>.</p><p>This code is valid for 15 minutes.</p>`,
  });
  return sendSuccess(res, 200, "If that email exists, an OTP has been sent.");
}

// B. Step 2: Same Flow me OTP Verify Karke Password Update Karna (No Current Password Required)
export async function changePassword(req: Request, res: Response) {
  const { email, otp, newPassword, confirmPassword } = req.body;
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // 1. Latest OTP Record nikaalo
  const otpRecord = await authModel.findLatestOtpRecord(email);
  if (!otpRecord) {
    throw new ApiError(400, "All fields are required.");
  }
  // 2. Check 24 hour block
  if (otpRecord.blocked_until && otpRecord.blocked_until > new Date()) {
    throw new ApiError(
      429,
      "Too many failed attempts. Please try again after 24 hours.",
    );
  }

  // 3. Check Expiry
  if (otpRecord.expires_at < new Date()) {
    throw new ApiError(400, "OTP has expired.");
  }
  // 4. Verify OTP (3 Strike rate limiting rule)
  if (otpRecord.otp !== otp) {
    const currentAttempts = otpRecord.attempts + 1;
    if (currentAttempts >= 3) {
      const blockUntilTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await authModel.updateOtpAttempts({
        id: otpRecord.id,
        attempts: currentAttempts,
        blocked_until: blockUntilTime,
      });
      throw new ApiError(
        429,
        "Too many failed attempts. Please try again after 24 hours.",
      );
    } else {
      await authModel.updateOtpAttempts({
        id: otpRecord.id,
        attempts: currentAttempts,
        blocked_until: null,
      });
      throw new ApiError(400, "Invalid OTP.");
    }
  }

  // 5. OTP Correct hai, to use instantly burn/invalidate karo
  await authModel.burnOtpRecord({ id: otpRecord.id });

  // 6. Passwords Match Check
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match.");
  }

  // 7. Hash New Password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // 8. Update password in user table & Soft-delete OTP via Transaction
  await authModel.updatePasswordAndSoftDeleteOtp({
    email,
    passwordHash: hashedNewPassword,
    otpId: otpRecord.id,
  });
  return sendSuccess(
    res,
    200,
    "Password reset successfully. You can now login with your new password!",
  );
}

// =========================================================================
// FLOW 2: CHANGE PASSWORD (Login Ke Baad - Current Password ➔ New Password)
// =========================================================================
export async function changePasswordAfterLogin(req: Request, res: Response) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const email = (req as any).user?.email;
  
  // console.log("REQ USER:", req.user);
  // console.log("EMAIL:", (req as any).user?.email);

  if (!email || !currentPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }
  
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // 3. Current (Old) password ko database ke hashed password se verify karo via bcrypt
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  // 4.  new password aur confirm password match ho rahe hain ya nahi

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match.");
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  //5. model function call karke password update kar do (Bina kisi OTP dependency ke);

  await authModel.updateUserPasswordDirectly({
    email,
    passwordHash: hashedNewPassword,
  });

  return sendSuccess(res, 200, "Password updated successfully");
}

//============================================================
// REGISTER
//=============================================================
export async function register(req: Request, res: Response) {
  const data: RegisterDTO = req.body;

  // 1. Password confirmation
  if (data.password !== data.confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  // 2. Existing user check
  const existingUser = await authModel.findUserByEmail(data.email);

  console.log("EMAIL:", data.email);
  console.log("EXISTING USER:", existingUser);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // 3. Password hash
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 4. Owner role find
  const ownerRole = await roleModel.findByName("owner");

  if (!ownerRole) {
    throw new ApiError(500, "Owner role not configured");
  }

  // 5. Create user with Owner role
  const user = await authModel.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role_id: ownerRole.id,
  });
  //owner ko default permissions do
  await assignDefaultPermissions(user.id, ownerRole.name);

  return sendSuccess(res, 201, "Registration successful", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
    },
  });
}

//LOGIN
export async function login(req: Request, res: Response) {
  const data: LoginDTO = req.body;

  // 1. Model call — user dhundo (register wala function reuse)
  const user = await authModel.findUserByEmail(data.email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Password check (business logic)
  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }
  // 3. Token generate (business logic, DB nahi)
  const payload = {
    userId: user.id,
    userUuid: user.uuid,
    roleId: user.role_id,
     email: user.email,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 4. Model call — session save
  await authModel.createSession({
    user_id: user.id,
    session_token: refreshToken,
    ip_address: req.ip ?? "unknown",
    user_agent: req.headers["user-agent"] ?? "unknown",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  //cookie save in browser from server  res.cookie(name, value, options)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });
  return sendSuccess(res, 200, "Login successful", {
    accessToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

//REFRSHTOKEN
export async function refreshAccessToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  // 1. JWT verify (business logic, DB nahi)
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
  // 2. Model call — DB me real truth check karo
  const session = await authModel.findSessionByToken(refreshToken);

  // 3. Business rule check
  if (!session || !session.is_active || session.expires_at < new Date()) {
    throw new ApiError(401, "Session expired or revoked, please login again");
  }
  // 4. Naya access token banao (business logic)
  const payload = {
    userId: decoded.userId,
    userUuid: decoded.userUuid,
    roleId: decoded.roleId,
      email: decoded.email!,
  };
  const newAccessToken = generateAccessToken(payload);

  return sendSuccess(res, 200, "Access token refreshed", {
    accessToken: newAccessToken,
  });
}

//LOGOUT
export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  // 1. Model call — session revoke karo
  if (refreshToken) {
    await authModel.revokeSession(refreshToken);
  }
  // 2. Cookie clear (business logic, DB nahi)
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return sendSuccess(res, 200, "Logged out successfully");
}
