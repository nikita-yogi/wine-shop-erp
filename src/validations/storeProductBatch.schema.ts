import { z } from "zod";

export const createStoreProductBatchSchema = z
  .object({
    store_uuid: z.string().uuid(),
    product_uuid: z.string().uuid(),
    batch_number: z.string().min(1).max(100),
    purchase_price: z.number().min(0),
    selling_price: z.number().min(0),
    tax_rate: z.number().min(0).max(100).optional(),
    batch_quantity: z.number().min(0),
    expiry_date: z.iso.date().optional(),
    manufacture_date: z.iso.date().optional(),
  })
  .refine((d) => d.selling_price >= d.purchase_price, {
    message: "selling_price cannot be less than purchase_price",
    path: ["selling_price"],
  })
  .refine((d) => !d.expiry_date || !d.manufacture_date || d.expiry_date > d.manufacture_date, {
    message: "expiry_date must be after manufacture_date",
    path: ["expiry_date"],
  });

export const updateStoreProductBatchSchema = z.object({
  purchase_price: z.number().min(0).optional(),
  selling_price: z.number().min(0).optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  batch_quantity: z.number().min(0).optional(),
  expiry_date: z.iso.date().nullable().optional(),
  manufacture_date: z.iso.date().nullable().optional(),
});

export const storeProductBatchParamsSchema = z.object({
  uuid: z.string().uuid(),
});




