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
  authorizeRole("owner", "manager"),
  validate(createStoreSchema),
  storeController.create
);

router.get(
  "/",
  authorizeRole("owner", "manager", "shopkeeper", "staff"),
  storeController.list
);

router.get(
  "/:uuid",
  authorizeRole("owner", "manager", "shopkeeper", "staff"),
  validate(storeParamsSchema, "params"),
  storeController.getStore
);

router.patch(
  "/:uuid",
  authorizeRole("owner", "manager"),
  validate(storeParamsSchema, "params"),
  validate(updateStoreSchema),
  storeController.update
);

router.delete(
  "/:uuid",
  authorizeRole("owner"),
  validate(storeParamsSchema, "params"),
  storeController.remove
);

export default router;
