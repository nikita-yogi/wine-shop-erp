import type { z } from "zod";
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerParamsSchema
} from "../validations/customers.schema.js";

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerDTO = z.infer<typeof updateCustomerSchema>;
export type CustomerParamsDTO = z.infer<typeof customerParamsSchema>;