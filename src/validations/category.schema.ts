import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateCategorySchema =
  createCategorySchema.partial();

export const categoryParamsSchema = z.object({
  uuid: z.string().uuid("Invalid category UUID"),
});