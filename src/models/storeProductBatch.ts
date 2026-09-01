import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

const select = {
  uuid: true,
  batch_number: true,
  purchase_price: true,
  selling_price: true,
  quantity: true,
  expiry_date: true,
  manufacture_date: true,
  created_at: true,

  store_product: {
    select: {
      uuid: true,

      store: {
        select: {
          uuid: true,
          name: true,
          code: true,
        },
      },

      product: {
        select: {
          uuid: true,
          name: true,
          sku: true,
        },
      },
    },
  },

  supplier: {
    select: {
      uuid: true,
      name: true,
    },
  },
} satisfies Prisma.store_product_batchesSelect;

interface BatchInput {
  batch_number: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  expiry_date?: Date | null;
  manufacture_date?: Date | null;
  supplier_id?: number | null;
}

/**
 * Create a new batch for an already assigned store product.
 *
 * Flow:
 * Store + Product
 *      ↓
 * StoreProduct
 *      ↓
 * Batch
 */
const create = (
  store_id: number,
  product_id: number,
  data: BatchInput,
) => {
  return prisma.$transaction(async (tx) => {
    // First check whether this product is already assigned
    // to this store.
    const storeProduct = await tx.store_products.findUnique({
      where: {
        store_id_product_id: {
          store_id,
          product_id,
        },
      },
    });

    if (!storeProduct || storeProduct.deleted_at) {
      throw new ApiError(
        400,
        "Assign this product to the store before adding a batch",
      );
    }

    // Create batch through store_product_id.
    const batch = await tx.store_product_batches.create({
      data: {
        store_product_id: storeProduct.id,
        batch_number: data.batch_number,
        purchase_price: data.purchase_price,
        selling_price: data.selling_price,
        quantity: data.quantity,
        expiry_date: data.expiry_date ?? null,
        manufacture_date: data.manufacture_date ?? null,
        supplier_id: data.supplier_id ?? null,
      },
      select,
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
    orderBy: {
      expiry_date: "asc",
    },
    select,
  });
};

const count = (where: Prisma.store_product_batchesWhereInput) => {
  return prisma.store_product_batches.count({
    where,
  });
};

const findByUuid = (uuid: string) => {
  return prisma.store_product_batches.findFirst({
    where: {
      uuid,
      deleted_at: null,
    },
    select,
  });
};

const update = (
  uuid: string,
  data: Partial<Omit<BatchInput, "batch_number">>,
) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.store_product_batches.findFirst({
      where: {
        uuid,
        deleted_at: null,
      },
    });

    if (!existing) {
      throw new ApiError(404, "Batch not found");
    }

    const updated = await tx.store_product_batches.update({
      where: {
        uuid,
      },
      data: {
        ...(data.purchase_price !== undefined && {
          purchase_price: data.purchase_price,
        }),

        ...(data.selling_price !== undefined && {
          selling_price: data.selling_price,
        }),

        ...(data.quantity !== undefined && {
          quantity: data.quantity,
        }),

        ...(data.expiry_date !== undefined && {
          expiry_date: data.expiry_date,
        }),

        ...(data.manufacture_date !== undefined && {
          manufacture_date: data.manufacture_date,
        }),

        ...(data.supplier_id !== undefined && {
          supplier_id: data.supplier_id,
        }),
      },
      select,
    });

    return updated;
  });
};

const softDelete = (uuid: string) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.store_product_batches.findFirst({
      where: {
        uuid,
        deleted_at: null,
      },
    });

    if (!existing) {
      throw new ApiError(404, "Batch not found");
    }

    await tx.store_product_batches.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return;
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