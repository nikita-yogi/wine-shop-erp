// schemas/profile.schema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  phone: z.string().min(10).max(15).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  date_of_birth: z.string().optional(),
});



export const createUserByOwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["manager", "shopkeeper", "staff", "cashier"]), // owner yaha se exclude hai
  store_uuid: z.string().uuid("Invalid store UUID"),
});

export type CreateUserByOwnerDTO = z.infer<typeof createUserByOwnerSchema>;