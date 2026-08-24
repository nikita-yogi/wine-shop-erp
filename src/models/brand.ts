import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

import type {
  CreateBrandDTO,
  UpdateBrandDTO,
  BrandFilters,
} from "../types/brand.js";

const buildWhere = (
  filters: BrandFilters
): Prisma.brandsWhereInput => ({
  deleted_at: null,

  ...(filters.status !== undefined && {
    status: filters.status,
  }),
});

// const create = (data: CreateBrandDTO) => {
//   return prisma.brands.create({
//     data: {
//       name: data.name,
//       description: data.description,
//       status: data.status ?? "active",
//     },
//   });
// };


const create = (data: CreateBrandDTO) => {
  return prisma.brands.create({
    data,
  });
};


const findAll = (
  filters: BrandFilters,
  skip: number,
  take: number
) => {
  return prisma.brands.findMany({
    where: buildWhere(filters),
    skip,
    take,
    orderBy: {
      created_at: "desc",
    },
  });
};

const count = (filters: BrandFilters) => {
  return prisma.brands.count({
    where: buildWhere(filters),
  });
};

const findByUuid = (uuid: string) => {
  return prisma.brands.findFirst({
    where: {
      uuid,
      deleted_at: null,
    },
  });
};

const update = (
  uuid: string,
  data: UpdateBrandDTO
) => {
  return prisma.brands.update({
    where: {
      uuid,
    },
    data: {
      ...data,
    },
  });
};

const softDelete = (uuid: string) => {
  return prisma.brands.update({
    where: {
      uuid,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

export default {
  create,
  findAll,
  count,
  findByUuid,
  update,
  softDelete,
};