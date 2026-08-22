import prisma from "../config/prisma.js";

export const userModel = {
  findUserById: (userUuid: string) => {
    return prisma.users.findUnique({ where: { uuid: userUuid } });
  },

  updateUserProfile: (userUuid: string, data: any) => {
    return prisma.users.update({
      where: { uuid: userUuid },
      data: {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth)
          : undefined,
      },
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
