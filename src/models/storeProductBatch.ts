import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

const select = {
  uuid: true,
  batch_number: true,
  purchase_price: true,
  selling_price: true,
  tax_rate: true,
  batch_quantity: true,
  expiry_date: true,
  manufacture_date: true,
  created_at: true,
  store: { select: { uuid: true, name: true, code: true } },
  product: { select: { uuid: true, name: true, sku: true } },
} satisfies Prisma.store_product_batchesSelect;

interface BatchInput {
  batch_number: string;
  purchase_price: number;
  selling_price: number;
  tax_rate?: number;
  batch_quantity: number;
  expiry_date?: Date | null;
  manufacture_date?: Date | null;
}

// Create batch + bump store_products.stock — atomically, same transaction
const create = (store_id: number, product_id: number, data: BatchInput) => {
  return prisma.$transaction(async (tx) => {
    const storeProduct = await tx.store_products.findUnique({
      where: { store_id_product_id: { store_id, product_id } },
    });

    if (!storeProduct || storeProduct.deleted_at) {
      throw new ApiError(
        400,
        "Assign this product to the store before adding a batch",
      );
    }

    const batch = await tx.store_product_batches.create({
      data: { store_id, product_id, ...data },
      select,
    });

    await tx.store_products.update({
      where: { id: storeProduct.id },
      data: { stock: { increment: data.batch_quantity } },
    });

    return batch;
  });
};

const findAll = (
  where: Prisma.store_product_batchesWhereInput,
  skip: number,
  take: number,
) => {
  return prisma.store_product_batches.findMany({
    where,
    skip,
    take,
    orderBy: { expiry_date: "asc" },
    select,
  });
};

const count = (where: Prisma.store_product_batchesWhereInput) => {
  return prisma.store_product_batches.count({ where });
};

const findByUuid = (uuid: string) => {
  return prisma.store_product_batches.findFirst({
    where: { uuid, deleted_at: null },
    select,
  });
};

// Update fields; if batch_quantity changes, adjust store_products.stock by the DELTA only
const update = (
  uuid: string,
  data: Partial<Omit<BatchInput, "batch_number">>,
) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.store_product_batches.findFirst({
      where: { uuid, deleted_at: null },
    });
    if (!existing) throw new ApiError(404, "Batch not found");

    const updated = await tx.store_product_batches.update({
      where: { uuid },
      data,
      select,
    });

    if (data.batch_quantity !== undefined) {
      const delta = data.batch_quantity - Number(existing.batch_quantity);
      if (delta !== 0) {
        await tx.store_products.update({
          where: {
            store_id_product_id: {
              store_id: existing.store_id,
              product_id: existing.product_id,
            },
          },
          data: { stock: { increment: delta } },
        });
      }
    }

    return updated;
  });
};

// Soft delete + release remaining quantity from store_products.stock
const softDelete = (uuid: string) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.store_product_batches.findFirst({
      where: { uuid, deleted_at: null },
    });
    if (!existing) throw new ApiError(404, "Batch not found");

    await tx.store_product_batches.update({
      where: { uuid },
      data: { deleted_at: new Date() },
    });

    await tx.store_products.update({
      where: {
        store_id_product_id: {
          store_id: existing.store_id,
          product_id: existing.product_id,
        },
      },
      data: { stock: { decrement: existing.batch_quantity } },
    });
  });
};

export default { create, findAll, count, findByUuid, update, softDelete };
