import { Router } from "express";

import brandController from "../controllers/brand.js";

import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";

import {
  createBrandSchema,
  updateBrandSchema,
  brandParamsSchema,
} from "../validations/brand.schema.js";

const router = Router();



router.post(
  "/",
  authorizePermission("manage_brands"),
  validate(createBrandSchema),
  brandController.create,
);

router.get("/", authorizePermission("manage_brands"), brandController.list);

router.get(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  brandController.getBrand,
);

router.patch(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  validate(updateBrandSchema),
  brandController.update,
);

router.delete(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  brandController.remove,
);

export default router;
