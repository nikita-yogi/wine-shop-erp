import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validations/user.schema.js";
import { updateProfile ,getProfile,deleteProfile} from "../controllers/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, validate(updateProfileSchema), updateProfile);
router.delete("/:userUuid",authMiddleware,deleteProfile
);


export default router;