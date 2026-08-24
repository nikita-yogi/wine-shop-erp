import { Router } from "express";
import storeController from "../controllers/store.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { validate } from "../middleware/validate.js";
import {
  createStoreSchema,
  updateStoreSchema,
  storeParamsSchema,
} from "../validations/store.schema.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRole("Owner", "manager"),
  validate(createStoreSchema),
  storeController.create
);

router.get(
  "/",
  authorizeRole("Owner", "manager", "shopkeeper", "staff"),
  storeController.list
);

router.get(
  "/:uuid",
  authorizeRole("Owner", "manager", "shopkeeper", "staff"),
  validate(storeParamsSchema, "params"),
  storeController.getStore
);

router.patch(
  "/:uuid",
  authorizeRole("Owner", "manager"),
  validate(storeParamsSchema, "params"),
  validate(updateStoreSchema),
  storeController.update
);

router.delete(
  "/:uuid",
  authorizeRole("Owner"),
  validate(storeParamsSchema, "params"),
  storeController.remove
);

export default router;
