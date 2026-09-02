import prisma from "../config/prisma.js";

const select = {
  uuid: true,
  store_id: true,
  product_id: true,
  created_at: true,
  updated_at: true,

  store: {
    select: {
      uuid: true,
      name: true,
    },
  },

  product: {
    select: {
      uuid: true,
      name: true,
      sku: true,
      barcode: true,
    },
  },
};

const storeProductModel = {
  create: (storeId: number, productId: number) => {
    return prisma.store_products.create({
      data: {
        store_id: storeId,
        product_id: productId,
      },
      select,
    });
  },

  findByUuid: (uuid: string) => {
    return prisma.store_products.findFirst({
      where: {
        uuid,
        deleted_at: null,
      },
      select,
    });
  },

  findAll: (
    where: {
      deleted_at: null;
      store?: {
        uuid: string;
      };
      product?: {
        uuid: string;
      };
    },
    skip: number,
    take: number,
  ) => {
    return prisma.store_products.findMany({
      where,
      skip,
      take,
      orderBy: {
        created_at: "desc",
      },
      select,
    });
  },

  count: (where: {
    deleted_at: null;
    store?: {
      uuid: string;
    };
    product?: {
      uuid: string;
    };
  }) => {
    return prisma.store_products.count({
      where,
    });
  },

  update: (
    uuid: string,
    storeId?: number,
    productId?: number,
  ) => {
    return prisma.store_products.update({
      where: {
        uuid,
      },
      data: {
        ...(storeId !== undefined && {
          store_id: storeId,
        }),

        ...(productId !== undefined && {
          product_id: productId,
        }),
      },
      select,
    });
  },

  softDelete: (uuid: string) => {
    return prisma.store_products.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  },
};

export default storeProductModel;