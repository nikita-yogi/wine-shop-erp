import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),

  description: z.string().max(255).optional(),

  sku: z.string().min(1, "SKU is required").max(100),

  barcode: z.string().max(100).optional(),

  brand_uuid: z.string().uuid("Invalid brand UUID"),

  category_uuid: z.string().uuid("Invalid category UUID"),

  product_type_uuid: z.string().uuid("Invalid product type UUID"),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  uuid: z.string().uuid("Invalid product UUID"),
});
