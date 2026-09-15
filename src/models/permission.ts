import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const permissionModel = {

  findByName: (name: string,
     tx: Prisma.TransactionClient = prisma
  ) => {
    return tx.permission.findUnique({
      where: { name },
    });
  },
};


export const userPermissionModel = {
  assignPermission: (
    userId: number,
    permissionId: number,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return tx.user_permissions.create({
      data: {
        user_id: userId,
        permission_id: permissionId,
      },
    });
  },

  hasPermission: async (userId: number, permissionName: string) => {
    const record = await prisma.user_permissions.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
        permission: {
          name: permissionName,
        },
      },
    });

    return !!record;
  },
};



// export const userPermissionModel = {

//   assignPermission: (userId: number, permissionId: number) => {
//     return prisma.user_permissions.create({
//       data: {
//         user_id: userId,
//         permission_id: permissionId,
//       },
//     });
//   },

//   hasPermission: async (userId: number, permissionName: string) => {
//     const record = await prisma.user_permissions.findFirst({
//       where: {
//         user_id: userId,
//         deleted_at: null,
//         permission: {
//           name: permissionName,
//         },
//       },
//     });

//     return !!record;
//   },
// };