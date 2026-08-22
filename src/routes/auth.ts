import { Router } from "express";
import { validate } from "../middleware/validate.js"
 import {login,register,refreshAccessToken,logout} from "../controllers/auth.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js"
 const router = Router();

 router.post("/register", validate(registerSchema), register);
 router.post("/login", validate( loginSchema),login);
 router.post("/refresh-token", refreshAccessToken);
 router.post("/logout",logout);


 export default router;