import { z } from "zod";

export const createCustomerSchema = z.object({
      name: z.string().trim().min(2),
    
      phone_no: z.string().trim().min(10),
    
      email: z.email().trim().optional(),
    
      dob: z.iso.date().optional(),

      address: z.string().trim().optional(),
    
      city: z.string().trim().optional(),
    
      state: z.string().trim().optional(),
    
});

export const updateCustomerSchema = createCustomerSchema.partial()
    .refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  }
);

export const customerParamsSchema = z.object({

    uuid: z.string().uuid(),

});








 