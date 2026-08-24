import type { Request, Response, NextFunction } from "express";
import { userPermissionModel } from "../models/permission.js";

// Humne 'string | string[]' kiya taaki single string aur array dono accept ho sakein
export function authorizePermission(requiredPermission: string | string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 1. Agar string hai toh use array mein convert kar do
    const permissionsToCheck = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    let hasAccess = false;

    // 2. Database check loop: Agar unme se KOI BHI EK permission user ke paas hai toh access de do (OR Condition)
    for (const permission of permissionsToCheck) {
      const allowed = await userPermissionModel.hasPermission(userId, permission);
      if (allowed) {
        hasAccess = true;
        break; // Ek bhi permission mil gayi toh aage check karne ki zaroorat nahi
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ error: "You don't have permission to perform this action" });
    }

    next();
  };
}


// export function authorizePermission(requiredPermission: string | string[]) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.user?.userId;

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const hasAccess = await userPermissionModel.hasPermission(userId, requiredPermission);

//     if (!hasAccess) {
//       return res.status(403).json({ error: "You don't have permission to perform this action" });
//     }

//     next();
//   };
// }