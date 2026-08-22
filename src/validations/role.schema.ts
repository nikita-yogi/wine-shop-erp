import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;