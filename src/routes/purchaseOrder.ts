import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import {
  createPurchaseOrderSchema,
  purchaseOrderUuidParamSchema ,
  PurchaseOrderListQuerySchema
} from "../validations/purchaseOrder.js";
import {
  createpurchaseOrder,
   getpurchaseOrder,
   purchaseOrderListHandler

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


export default router;