import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";
import { createRoleSchema, updateRoleSchema } from "../validations/role.schema.js";
import {
  createRole,
  getAllRoles,
  getRoleByUuid,
  updateRole,
  deleteRole,
} from "../controllers/role.js";

const router = Router();

router.get("/", authMiddleware, getAllRoles);
router.get("/:uuid", authMiddleware, getRoleByUuid);
router.post("/", authMiddleware, validate(createRoleSchema), createRole);
router.put("/:uuid", authMiddleware, validate(updateRoleSchema), updateRole);
router.delete("/:uuid", authMiddleware, deleteRole);

export default router;