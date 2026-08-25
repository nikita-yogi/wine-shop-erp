import { z } from "zod";

export const createProductTypeSchema = z.object({
  name: z.string().trim().min(2).max(100),

  volume_ml: z.number().positive().optional(),

  unit: z.string().trim().max(50).optional(),

  unit_value: z.number().positive().optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateProductTypeSchema = createProductTypeSchema
  .partial()
  .extend({
    volume_ml: z.number().positive().nullable().optional(),

    unit: z.string().trim().max(50).nullable().optional(),

    unit_value: z.number().positive().nullable().optional(),
  });

export const productTypeParamsSchema = z.object({
  uuid: z.string().uuid(),
});