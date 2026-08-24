import { Prisma } from "@prisma/client";

import prisma from "../config/prisma.js";

import type {
  CreateProductTypeDTO,
  UpdateProductTypeDTO,
  ProductTypeFilters,
} from "../types/productType.js";

const buildWhere = (
  filters: ProductTypeFilters,
): Prisma.product_typesWhereInput => ({
  deleted_at: null,

  ...(filters.status !== undefined && {
    status: filters.status,
  }),
});

const create = (data: CreateProductTypeDTO) => {
  return prisma.product_types.create({
    data,
  });
};

const findAll = (filters: ProductTypeFilters, skip: number, take: number) => {
  return prisma.product_types.findMany({
    where: buildWhere(filters),
    skip,
    take,
    orderBy: {
      created_at: "desc",
    },
  });
};

const count = (filters: ProductTypeFilters) => {
  return prisma.product_types.count({
    where: buildWhere(filters),
  });
};

const findByUuid = (uuid: string) => {
  return prisma.product_types.findFirst({
    where: {
      uuid,
      deleted_at: null,
    },
  });
};

const update = (uuid: string, data: UpdateProductTypeDTO) => {
  return prisma.product_types.update({
    where: {
      uuid,
    },
    data,
  });
};

const softDelete = (uuid: string) => {
  return prisma.product_types.update({
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
