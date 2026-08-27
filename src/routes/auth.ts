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
  verifyForgotAndResetPassword,
  changePasswordAfterLogin,
} from "../controllers/auth.js"; // Aapka path
import { authMiddleware } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js"

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login",  authLimiter , validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

// Password Reset Endpoints (Public access)
router.post("/forgot-password",authLimiter, forgotPassword);
router.post("/verify-forgot-reset", authLimiter, verifyForgotAndResetPassword);
router.post("/reset-password",   authMiddleware, authLimiter,changePasswordAfterLogin);

export default router;
