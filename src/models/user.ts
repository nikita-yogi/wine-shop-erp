import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const userModel = {
  findUserById: (userUuid: string) => {
    return prisma.users.findUnique({ where: { uuid: userUuid } });
  },

  updateUserProfile: async(userUuid: string, data: any) => {
    const user = await prisma.users.update({
      where: { uuid: userUuid },
      data: {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth)
          : undefined,
      },
    });
    const { password, ...safeUser } = user;

    return safeUser;
  },



  // createUserWithRole: (data: {
  //   name: string;
  //   email: string;
  //   password: string;
  //   role_id: number;
  // }) => {
  //   return prisma.users.create({ data });
  // },
  
  createUserWithRole: (
  data: {
    name: string;
    email: string;
    password: string;
    role_id: number;
  },
  tx: Prisma.TransactionClient = prisma
) => {
  return tx.users.create({ data });
},
  
  
  findAllUsers: () => {
    return prisma.users.findMany({
        where: {
        deleted_at: null, 
      },
      include: { role: true },
    });
  },

  getUserProfile: (userUuid: string) => {
    return prisma.users.findUnique({
      where: { uuid: userUuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        date_of_birth: true,
        role_id: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  },

  delteUsereProfile: (userUuid: string) => {
    return prisma.users.update({
      where: { uuid: userUuid },
      data: {
        deleted_at: new Date(),
      },
    });
  },
};
