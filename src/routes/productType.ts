import { Router } from "express";

import productTypeController from "../controllers/productType.js";

import { authMiddleware } from "../middleware/auth.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
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
  authorizePermission("manage_product_types"),
  validate(createProductTypeSchema),
  productTypeController.create
);

// LIST
router.get(
  "/",
  authorizePermission("view_product_types"),
  productTypeController.list
);

// GET SINGLE
router.get(
  "/:uuid",
  authorizePermission("view_product_types"),
  validate(productTypeParamsSchema, "params"),
  productTypeController.getProductType
);

// UPDATE
router.patch(
  "/:uuid",
  authorizePermission("manage_product_types"),
  validate(productTypeParamsSchema, "params"),
  validate(updateProductTypeSchema),
  productTypeController.update
);

// DELETE
router.delete(
  "/:uuid",
  authorizePermission("manage_product_types"),
  validate(productTypeParamsSchema, "params"),
  productTypeController.remove
);

export default router;