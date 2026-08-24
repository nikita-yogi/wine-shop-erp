import { Router } from "express";

import categoryController from "../controllers/category.js";

import { authMiddleware } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { validate } from "../middleware/validate.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../validations/category.schema.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRole("owner", "manager"),
  validate(createCategorySchema),
  categoryController.create
);

router.get(
  "/",
  authorizeRole(
    "owner",
    "manager",
    "shopkeeper",
    "staff"
  ),
  categoryController.list
);

router.get(
  "/:uuid",
  authorizeRole(
    "owner",
    "manager",
    "shopkeeper",
    "staff"
  ),
  validate(categoryParamsSchema, "params"),
  categoryController.getCategory
);

router.patch(
  "/:uuid",
  authorizeRole("owner", "manager"),
  validate(categoryParamsSchema, "params"),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  "/:uuid",
  authorizeRole("owner"),
  validate(categoryParamsSchema, "params"),
  categoryController.remove
);

export default router;