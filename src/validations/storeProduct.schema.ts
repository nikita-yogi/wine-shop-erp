import { z } from "zod";

export const createStoreProductSchema = z.object({
  store_uuid: z.string().uuid(),
  product_uuid: z.string().uuid(),
});

export const updateStoreProductSchema = z
  .object({
    store_uuid: z.string().uuid().optional(),
    product_uuid: z.string().uuid().optional(),
  })
  .refine(
    (data) =>
      data.store_uuid !== undefined ||
      data.product_uuid !== undefined,
    {
      message: "At least one field is required",
    },
  );

export const storeProductParamsSchema = z.object({
  uuid: z.string().uuid(),
});