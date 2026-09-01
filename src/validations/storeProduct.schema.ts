import { z } from "zod";

export const createStoreProductSchema = z.object({
  store_uuid: z.string().uuid(),
  product_uuid: z.string().uuid(),
  stock: z.number().min(0).optional(),
});

export const updateStoreProductSchema = z.object({
  stock: z.number().min(0),
});

export const storeProductParamsSchema = z.object({
  uuid: z.string().uuid(),
});