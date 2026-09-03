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


import { authorizePermission } from "../middleware/authorizePermission.js";
import { createUserByOwnerSchema } from "../validations/user.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 

const router = Router();

// ==========================================================
//  1. OWNER LEVEL ROUTES (Sirf Owner Chala Sakta Hai)
// PATH: GET http://localhost:5000/api/users/
// ==========================================================
//  Naya cashier ya staff create karna
router.post(
  "/",
  authorizePermission("manage_users"), // sirf woh log jinke paas yeh permission hai (owner ke paas hai)
  validate(createUserByOwnerSchema),
   asyncHandler(createUserByOwner),
);

// Saare employees ki list dekhna (Owner ke liye)
router.get("/",
  authorizePermission("view_users"),
    asyncHandler(getAll)
  );


   // Kisi cashier/staff ko delete karna
router.delete(
  "/:uuid",
  authorizePermission("manage_users"),
   asyncHandler(deleteProfile),
);


// ==========================================
// 2. ALL EMPLOYEES ROUTE (Owner, Cashier, Staff, Manager)
// PATH: GET http://localhost:5000/api/users/profile
// ===========================================

//  jis role se login hai, woh apni khud ki profile dekh sake 

router.get(
  "/profile",
   asyncHandler(getProfile )// Isme koi extra permission nahi chahiye, har koi dekh sakta hai
);

// kud ki info updated krna
router.put(
  "/profile",
  validate(updateProfileSchema),
   asyncHandler(updateProfile),
);

export default router;
