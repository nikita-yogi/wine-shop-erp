import { Router } from "express";
import storeProductBatchController from "../controllers/storeProductBatch.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";
import {
  createStoreProductBatchSchema,
  updateStoreProductBatchSchema,
  storeProductBatchParamsSchema,
} from "../validations/storeProductBatch.schema.js";

const router = Router();

router.post(
  "/",
  authorizePermission("manage_inventory"),
  validate(createStoreProductBatchSchema),
  storeProductBatchController.create,
);
router.get(
  "/",
  authorizePermission("view_inventory"),
  storeProductBatchController.list,
);
router.get(
  "/:uuid",
  authorizePermission("view_inventory"),
  validate(storeProductBatchParamsSchema, "params"),
  storeProductBatchController.getOne,
);
router.patch(
  "/:uuid",
  authorizePermission("manage_inventory"),
  validate(storeProductBatchParamsSchema, "params"),
  validate(updateStoreProductBatchSchema),
  storeProductBatchController.update,
);
router.delete(
  "/:uuid",
  authorizePermission("manage_inventory"),
  validate(storeProductBatchParamsSchema, "params"),
  storeProductBatchController.remove,
);

export default router;
