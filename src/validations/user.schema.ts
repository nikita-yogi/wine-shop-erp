// schemas/profile.schema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  date_of_birth: z.string().optional(),
});