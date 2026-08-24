import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validations/user.schema.js";
import {
  updateProfile,
  getProfile,
  deleteProfile,
  createUserByOwner,
  getAll
  
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/auth.js";

import { authorizePermission } from "../middleware/authorizePermission.js";
import { createUserByOwnerSchema } from "../validations/user.schema.js";

const router = Router();

// ==========================================================
// 🏢 1. OWNER LEVEL ROUTES (Sirf Owner Chala Sakta Hai)
// PATH: GET http://localhost:5000/api/users/
// ==========================================================
//  Naya cashier ya staff create karna
router.post(
  "/",
  authMiddleware,
  authorizePermission("manage_users"), // sirf woh log jinke paas yeh permission hai (owner ke paas hai)
  validate(createUserByOwnerSchema),
  createUserByOwner,
);

// Saare employees ki list dekhna (Owner ke liye)
router.get("/", authMiddleware, 
  authorizePermission("view_users"),
   getAll);


   // Kisi cashier/staff ko delete karna
router.delete(
  "/:userUuid",
  authMiddleware,
  authorizePermission("manage_users"),
  deleteProfile,
);


// ==========================================
// 2. ALL EMPLOYEES ROUTE (Owner, Cashier, Staff, Manager)
// PATH: GET http://localhost:5000/api/users/profile
// ===========================================

//  jis role se login hai, woh apni khud ki profile dekh sake 

router.get(
  "/profile",
  authMiddleware,
  getProfile // Isme koi extra permission nahi chahiye, har koi dekh sakta hai
);

// kud ki info updated krna
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile,
);

export default router;
