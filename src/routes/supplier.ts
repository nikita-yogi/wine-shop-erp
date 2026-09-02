import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import {
  createSupplierSchema,
  supplierUuidParamSchema,
  updateSupplierSchema
} from "../validations/supplier.js";
import {
  createSupplierHandler,
  getSupplierByUuid,
  updatedSupplier,
  deleteSupplier,
} from "../controllers/supplier.js";
const router = Router();

router.post(
  "/",
  authorizePermission("manage_suppliers"),
  validate(createSupplierSchema),
  asyncHandler(createSupplierHandler),
);
router.get(
  "/:uuid",
  authorizePermission("manage_suppliers"),
  validate(supplierUuidParamSchema,"params"),
  asyncHandler(getSupplierByUuid),
);

router.patch(
  "/:uuid",
  authorizePermission("manage_suppliers"),
  validate(supplierUuidParamSchema,"params"),
  validate(updateSupplierSchema,"body"),
  asyncHandler(updatedSupplier),
);


router.delete(
  "/:uuid",
  authorizePermission("manage_suppliers"),
  validate(supplierUuidParamSchema,"params"),
  asyncHandler(deleteSupplier),
);



export default router;
