import type {
  CreateRoleDTO,
  UpdateRoleDTO,
} from "../validations/role.schema.js";
import prisma from "../config/prisma.js";


export const roleModel = {
  findAll: () => {
    return prisma.roles.findMany({ where: { deleted_at: null } });
  },
  findByUuid: (uuid: string) => {
    return prisma.roles.findUnique({ where: { uuid } });
  },

  findById: (id: number) => {
    return prisma.roles.findUnique({ where: { id } });
  },
  findByName: (name: string) => {
    return prisma.roles.findUnique({ where: { name } });
  },
  create: (data: CreateRoleDTO) => {
    return prisma.roles.create({ data });
  },
  updated: (uuid: string, data: UpdateRoleDTO) => {
    return prisma.roles.update({
      where: { uuid },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  },
  softdelete: (uuid: string) => {
    return prisma.roles.update({
      where: { uuid },
      data: { deleted_at: new Date() },
    });
  },
};