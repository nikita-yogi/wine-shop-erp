import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import {
  createSupplierSchema,
  supplierUuidParamSchema,
  updateSupplierSchema,
  supplierListQuerySchema
} from "../validations/supplier.js";
import {
  createSupplierHandler,
  getSupplierByUuid,
  listSupplier,
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
router.get(
  "/",
  authorizePermission("manage_suppliers"),
  validate(supplierListQuerySchema, "query"),
  asyncHandler(listSupplier),
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
