import { z } from "zod";
import { purchase_orders_status } from "@prisma/client";

export const purchaseOrderItemSchema = z.object({
  product_uuid: z.string().uuid(),
  quantity: z.number().positive(),
  unit_cost: z.number().positive(),
  unit_per_pack: z.number().positive().optional(),
  base_quantity: z.number().positive().optional(),
});

export const createPurchaseOrderSchema = z.object({
  supplier_uuid: z.string().uuid(),
  store_uuid: z.string().uuid(),
  purchase_date: z.string().datetime().or(z.string().date()),
  discount: z.number().min(0).optional().default(0),
  tax_amount: z.number().min(0).optional().default(0),
  payment_method: z.string().max(50).optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
});

export const purchaseOrderUuidParamSchema = z.object({
  uuid: z.uuid("Invalid purchase order uuid"),
});


export const PurchaseOrderListQuerySchema = z.object({
    // Pagination Fields
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  
  // Filter & Search Fields
  status: z.string().optional(),
 supplier_uuid:  z.string().uuid().optional(),
  store_uuid:  z.string().uuid().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});


export const updatePurchaseOrderStatusSchema = z.object({
  status: z.nativeEnum(purchase_orders_status),
});