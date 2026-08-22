import type { Request, Response, NextFunction } from "express";
import { roleModel } from "../models/role.js";

export function authorizeRole(...allowedRoleNames: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const roleId = req.user?.roleId;

    if (!roleId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = await roleModel.findById(roleId);
    if (!role || !allowedRoleNames.includes(role.name)) {
      return res.status(403).json({ error: "You don't have permission to perform this action" });
    }

    next();
  };
}