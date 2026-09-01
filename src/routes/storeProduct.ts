import { Router } from "express";
import storeProductController from "../controllers/storeProduct.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";
import {
  createStoreProductSchema,
  updateStoreProductSchema,
  storeProductParamsSchema,
} from "../validations/storeProduct.schema.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizePermission("manage_inventory"),
  validate(createStoreProductSchema),
  storeProductController.create
);

router.get("/", authorizePermission("view_inventory"), storeProductController.list);

router.get(
  "/:uuid",
  authorizePermission("view_inventory"),
  validate(storeProductParamsSchema, "params"),
  storeProductController.getOne
);

router.patch(
  "/:uuid",
  authorizePermission("manage_inventory"),
  validate(storeProductParamsSchema, "params"),
  validate(updateStoreProductSchema),
  storeProductController.update
);

router.delete(
  "/:uuid",
  authorizePermission("manage_inventory"),
  validate(storeProductParamsSchema, "params"),
  storeProductController.remove
);

export default router;