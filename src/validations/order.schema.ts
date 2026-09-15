import { z } from "zod";

export const createOrderSchema = z.object({
    
  customer_uuid: z.string().uuid().optional(),

  store_uuid: z.string().uuid(),

  order_date: z.string().datetime(),

  payment_method: z.string().trim().min(1).max(50).optional(),

  items: z
    .array(
      z.object({
        batch_uuid: z.string().uuid(),

        store_product_uuid: z.string().uuid(),

        quantity: z.number().positive(),
      }),
    )
    .min(1),
});

export const updateOrderSchema = z
  .object({
    customer_uuid: z.string().uuid().optional(),

    order_date: z.string().datetime().optional(),

    payment_method: z.string().trim().min(1).max(50).optional(),

    status: z.string().trim().min(1).max(50).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const orderParamsSchema = z.object({
  uuid: z.string().uuid(),
});
