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


//brand create
router.post(
  "/",
  authorizePermission("manage_brands"),
  validate(createBrandSchema),
  brandController.create,
);

//  get list of brand brand 
router.get("/", authorizePermission("manage_brands"), brandController.list);

//brand 
router.get(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  brandController.getBrand,
);

//brand 
router.patch(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  validate(updateBrandSchema),
  brandController.update,
);

//brand 
router.delete(
  "/:uuid",
  authorizePermission("manage_brands"),
  validate(brandParamsSchema, "params"),
  brandController.remove,
);

export default router;
