import { Router } from "express";

import categoryController from "../controllers/category.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../validations/category.schema.js";

const router = Router();



router.post(
  "/",
  authorizePermission("manage_categories"),
  validate(createCategorySchema),
  categoryController.create
);

router.get(
  "/",
  authorizePermission("view_categories"),
  categoryController.list
);

router.get(
  "/:uuid",
  authorizePermission("view_categories"),
  validate(categoryParamsSchema, "params"),
  categoryController.getCategory
);

router.patch(
  "/:uuid",
  authorizePermission("manage_categories"),
  validate(categoryParamsSchema, "params"),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  "/:uuid",
  authorizePermission("manage_categories"),
  validate(categoryParamsSchema, "params"),
  categoryController.remove
);

export default router;