import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

// Explicit select — never leak internal numeric ids
const select = {
  uuid: true,
  stock: true,
  created_at: true,
  updated_at: true,
  store: { select: { uuid: true, name: true, code: true } },
  product: { select: { uuid: true, name: true, sku: true } },
} satisfies Prisma.store_productsSelect;

/**
 * Create, but "undelete" a soft-deleted row instead of failing on the
 * unique constraint. See review section — @@unique([store_id, product_id])
 * blocks re-creation after a soft delete otherwise.
 */
const create = async (store_id: number, product_id: number, stock: number) => {
  const existing = await prisma.store_products.findUnique({
    where: { store_id_product_id: { store_id, product_id } },
  });

  if (existing) {
    if (!existing.deleted_at) {
      throw new ApiError(409, "This product is already assigned to this store");
    }
    return prisma.store_products.update({
      where: { id: existing.id },
      data: { stock, deleted_at: null },
      select,
    });
  }

  return prisma.store_products.create({
    data: { store_id, product_id, stock },
    select,
  });
};

const findAll = (where: Prisma.store_productsWhereInput, skip: number, take: number) => {
  return prisma.store_products.findMany({ where, skip, take, orderBy: { created_at: "desc" }, select });
};

const count = (where: Prisma.store_productsWhereInput) => {
  return prisma.store_products.count({ where });
};

const findByUuid = (uuid: string) => {
  return prisma.store_products.findFirst({ where: { uuid, deleted_at: null }, select });
};

const update = (uuid: string, stock: number) => {
  return prisma.store_products.update({ where: { uuid }, data: { stock }, select });
};

const softDelete = (uuid: string) => {
  return prisma.store_products.update({ where: { uuid }, data: { deleted_at: new Date() } });
};

export default { create, findAll, count, findByUuid, update, softDelete };