import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(2),

  code: z.string().min(1),

  license_no: z.string().optional(),

  expiry_date: z.iso.date().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  pincode: z.string().optional(),

  status: z.enum(["open", "closed", "suspended", "license_expired"]).optional(),

  phone_no: z.string().optional(),

  email: z.email().optional(),

  tax_rate: z.number().min(0).max(100).optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const storeParamsSchema = z.object({
  uuid: z.string().uuid(),
});
