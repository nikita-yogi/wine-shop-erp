import { Router } from "express";

import productController from "../controllers/product.js";

import { authorizePermission } from "../middleware/authorizePermission.js";

import { validate } from "../middleware/validate.js";

import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} from "../validations/product.schema.js";

const router = Router();

router.post(
  "/",
  authorizePermission("manage_products"),
  validate(createProductSchema),
  productController.create
);

router.get(
  "/",
  authorizePermission("view_products"),
  productController.list
);

router.get(
  "/:uuid",
  authorizePermission("view_products"),
  validate(productParamsSchema, "params"),
  productController.getProduct
);

router.patch(
  "/:uuid",
  authorizePermission("manage_products"),
  validate(productParamsSchema, "params"),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  "/:uuid",
  authorizePermission("manage_products"),
  validate(productParamsSchema, "params"),
  productController.remove
);

export default router;