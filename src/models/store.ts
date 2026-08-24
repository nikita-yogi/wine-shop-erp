import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import type {
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreFilters,
} from "../types/store.js";

const buildWhere = (filters: StoreFilters): Prisma.storesWhereInput => ({
  deleted_at: null,
  ...(filters.status !== undefined && { status: filters.status }),
  ...(filters.city !== undefined && { city: filters.city }),
});

const create = (data: CreateStoreDTO) => {
  const storeData = {
    ...data,
    expiry_date: data.expiry_date
      ? new Date(`${data.expiry_date}T00:00:00.000Z`)
      : null,
  };

  return prisma.stores.create({ data: storeData });
};

const findAll = (filters: StoreFilters, skip: number, take: number) => {
  return prisma.stores.findMany({
    where: buildWhere(filters),
    skip,
    take,
    orderBy: { created_at: "desc" },
  });
};

const count = (filters: StoreFilters) => {
  return prisma.stores.count({ where: buildWhere(filters) });
};

const findByUuid = (uuid: string) => {
  return prisma.stores.findFirst({
    where: { uuid, deleted_at: null },
  });
};

const update = (uuid: string, data: UpdateStoreDTO) => {
  const { expiry_date, ...storeFields } = data;

  return prisma.stores.update({
    where: { uuid },
    data: {
      ...storeFields,
      ...(expiry_date !== undefined && {
        expiry_date: expiry_date
          ? new Date(`${expiry_date}T00:00:00.000Z`)
          : null,
      }),
    },
  });
};

const softDelete = (uuid: string) => {
  return prisma.stores.update({
    where: { uuid },
    data: { deleted_at: new Date() },
  });
};

export default { create, findAll, count, findByUuid, update, softDelete };
