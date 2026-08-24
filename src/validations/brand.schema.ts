import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .optional(),
    
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export const brandParamsSchema = z.object({
  uuid: z.string().uuid("Invalid brand UUID"),
});
