import { Router } from "express";

import brandController from "../controllers/brand.js";

import { authMiddleware } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { validate } from "../middleware/validate.js";

import {
  createBrandSchema,
  updateBrandSchema,
  brandParamsSchema,
} from "../validations/brand.schema.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRole("owner", "manager"),
  validate(createBrandSchema),
  brandController.create
);

router.get(
  "/",
  authorizeRole(
    "owner",
    "manager",
    "shopkeeper",
    "staff"
  ),
  brandController.list
);

router.get(
  "/:uuid",
  authorizeRole(
    "owner",
    "manager",
    "shopkeeper",
    "staff"
  ),
  validate(
    brandParamsSchema,
    "params"
  ),
  brandController.getBrand
);

router.patch(
  "/:uuid",
  authorizeRole("owner", "manager"),
  validate(
    brandParamsSchema,
    "params"
  ),
  validate(updateBrandSchema),
  brandController.update
);

router.delete(
  "/:uuid",
  authorizeRole("owner"),
  validate(
    brandParamsSchema,
    "params"
  ),
  brandController.remove
);

export default router;