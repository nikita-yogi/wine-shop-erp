import prisma from "../config/prismaClient.ts";
import type {
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreFilters,
} from "../types/store.ts";

const buildWhere = (filters: StoreFilters) => ({
  deleted_at: null,
  ...(filters.status && { status: filters.status as any }),
  ...(filters.city && { city: filters.city }),
});

// const create = (data: CreateStoreDTO) => {
//   return prisma.stores.create({ data: data as any });
// };

const create = (data: CreateStoreDTO) => {
  const storeData = {
    ...data,
    expiry_date: data.expiry_date
      ? new Date(`${data.expiry_date}T00:00:00.000Z`)
      : null,
  };

  return prisma.stores.create({
    data: storeData as any,
  });
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
  return prisma.stores.update({
    where: { uuid },
    data: data as any,
  });
};

const softDelete = (uuid: string) => {
  return prisma.stores.update({
    where: { uuid },
    data: { deleted_at: new Date() },
  });
};

export default { create, findAll, count, findByUuid, update, softDelete };
