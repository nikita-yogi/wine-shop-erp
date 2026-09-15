import { Router } from "express";
import storeController from "../controllers/store.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";
import {
  createStoreSchema,
  updateStoreSchema,
  storeParamsSchema,
} from "../validations/store.schema.js";

const router = Router();



router.post(
  "/",
  authorizePermission("manage_stores"),
  validate(createStoreSchema),
  storeController.create,
);

router.get("/", authorizePermission("view_stores"), storeController.list);

router.get(
  "/:uuid",
  authorizePermission("view_stores"),
  validate(storeParamsSchema, "params"),
  storeController.getStore,
);

router.patch(
  "/:uuid",
  authorizePermission("manage_stores"),
  validate(storeParamsSchema, "params"),
  validate(updateStoreSchema),
  storeController.update,
);

router.delete(
  "/:uuid",
  authorizePermission("manage_stores"),
  validate(storeParamsSchema, "params"),
  storeController.remove,
);

export default router;
