import { Router } from "express";

import productTypeController from "../controllers/productType.js";

import { authMiddleware } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { validate } from "../middleware/validate.js";

import {
  createProductTypeSchema,
  updateProductTypeSchema,
  productTypeParamsSchema,
} from "../validations/productType.schema.js";

const router = Router();

router.use(authMiddleware);

// CREATE
router.post(
  "/",
  authorizeRole("owner", "manager"),
  validate(createProductTypeSchema),
  productTypeController.create
);

// LIST
router.get(
  "/",
  authorizeRole("owner", "manager", "shopkeeper", "staff"),
  productTypeController.list
);

// GET SINGLE
router.get(
  "/:uuid",
  authorizeRole("owner", "manager", "shopkeeper", "staff"),
  validate(productTypeParamsSchema, "params"),
  productTypeController.getProductType
);

// UPDATE
router.patch(
  "/:uuid",
  authorizeRole("owner", "manager"),
  validate(productTypeParamsSchema, "params"),
  validate(updateProductTypeSchema),
  productTypeController.update
);

// DELETE
router.delete(
  "/:uuid",
  authorizeRole("owner"),
  validate(productTypeParamsSchema, "params"),
  productTypeController.remove
);

export default router;