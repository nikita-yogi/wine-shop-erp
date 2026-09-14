import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

import { permissionModel, userPermissionModel } from "../models/permission.js";
import { DEFAULT_PERMISSIONS } from "../constants/defaultPermissions.js";

// export async function assignDefaultPermissions(
//   userId: number,
//   roleName: string,
//   tx: Prisma.TransactionClient = prisma

// ) {
//   const permissionName = DEFAULT_PERMISSIONS[roleName] ?? [];
//   for (const name of permissionName) {
//     const permission = await permissionModel.findByName(name);
//     if (permission) {
//       await userPermissionModel.assignPermission(userId, permission.id);
//     }
//   }
// }

export async function assignDefaultPermissions(
  userId: number,
  roleName: string,
  tx: Prisma.TransactionClient = prisma
) {
  const permissionName = DEFAULT_PERMISSIONS[roleName] ?? [];

  for (const name of permissionName) {
    const permission = await permissionModel.findByName(name, tx);

    if (permission) {
      await userPermissionModel.assignPermission(
        userId,
        permission.id,
        tx
      );
    }
  }
}