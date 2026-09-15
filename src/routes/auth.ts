import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  login,
  register,
  refreshAccessToken,
  logout,
} from "../controllers/auth.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";
import {
  forgotPassword,
 changePassword,
  changePasswordAfterLogin,
} from "../controllers/auth.js"; // Aapka path
import { authMiddleware } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js"
import { asyncHandler } from "../utils/asyncHandler.js"; 
const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login",  authLimiter , validate(loginSchema), asyncHandler(login));
router.post("/refresh-token", asyncHandler(refreshAccessToken));
router.post("/logout", asyncHandler(logout));

// Password Reset Endpoints (Public access)
router.post("/forgot-password",authLimiter, asyncHandler(forgotPassword));
router.post("/verify-forgot-reset", authLimiter, asyncHandler(changePassword));
router.post("/reset-password",   authMiddleware, authLimiter,asyncHandler(changePasswordAfterLogin));

export default router;
