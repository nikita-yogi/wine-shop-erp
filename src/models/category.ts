import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryFilters,
} from "../types/category.js";

const buildWhere = (
  filters: CategoryFilters
): Prisma.categoriesWhereInput => ({
  deleted_at: null,

  ...(filters.status !== undefined && {
    status: filters.status,
  }),
});

const create = (data: CreateCategoryDTO) => {
  return prisma.categories.create({
    data,
  });
};

const findAll = (
  filters: CategoryFilters,
  skip: number,
  take: number
) => {
  return prisma.categories.findMany({
    where: buildWhere(filters),
    skip,
    take,
    orderBy: {
      created_at: "desc",
    },
  });
};

const count = (filters: CategoryFilters) => {
  return prisma.categories.count({
    where: buildWhere(filters),
  });
};

const findByUuid = (uuid: string) => {
  return prisma.categories.findFirst({
    where: {
      uuid,
      deleted_at: null,
    },
  });
};

const update = (
  uuid: string,
  data: UpdateCategoryDTO
) => {
  return prisma.categories.update({
    where: {
      uuid,
    },
    data,
  });
};

const softDelete = (uuid: string) => {
  return prisma.categories.update({
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