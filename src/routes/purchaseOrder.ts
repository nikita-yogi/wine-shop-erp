import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import {
  createPurchaseOrderSchema,
  purchaseOrderUuidParamSchema ,
  PurchaseOrderListQuerySchema,
  updatePurchaseOrderStatusSchema
} from "../validations/purchaseOrder.js";
import {
  createpurchaseOrder,
   getpurchaseOrder,
   purchaseOrderListHandler,
   updatePurchaseOrderStatus ,
   cancelPurchaseOrder

} from "../controllers/purchaseOrder.js";

const router = Router();

//createpurchaseOrder
router.post("/", 
  authorizePermission("manage_purchases"),
  validate(createPurchaseOrderSchema),
  asyncHandler(createpurchaseOrder)
);

// get by uuid purchaseOrder
router.get("/:uuid", 
  authorizePermission("manage_purchases"),
  validate(purchaseOrderUuidParamSchema ,"params"),
  asyncHandler(getpurchaseOrder)
);

// get  All with pagination purchaseOrder
router.get("/", 
  authorizePermission("manage_purchases"),
  validate(  PurchaseOrderListQuerySchema ,"query"),
  asyncHandler( purchaseOrderListHandler)
);



//update PurchaseOrder Status :: cancel, pending, received, delivered
router.patch(
  "/:uuid/status",
  authorizePermission("manage_purchases"),
  validate(purchaseOrderUuidParamSchema, "params"),
  validate(updatePurchaseOrderStatusSchema, "body"),
  asyncHandler(updatePurchaseOrderStatus)
);
router.patch(
  "/:uuid/cancel",
  authorizePermission("manage_purchases"),
  validate(purchaseOrderUuidParamSchema, "params"),
  asyncHandler(cancelPurchaseOrder)
);

export default router;