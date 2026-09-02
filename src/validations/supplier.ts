import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2, "Name is required").max(150),
  phone_no: z.string().max(20).optional(),
  email: z.string().email().max(150).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  tax: z.string().max(100).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const supplierIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export const supplierUuidParamSchema = z.object({
  uuid: z.uuid(),
});

// export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
// export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;



