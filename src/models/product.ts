import { Prisma } from "@prisma/client";

import prisma from "../config/prisma.js";

import type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "../types/product.js";

const buildWhere = (filters: ProductFilters): Prisma.productsWhereInput => ({
  deleted_at: null,

  ...(filters.status !== undefined && {
    status: filters.status,
  }),

  ...(filters.brand_uuid !== undefined && {
    brand: {
      uuid: filters.brand_uuid,
    },
  }),

  ...(filters.category_uuid !== undefined && {
    category: {
      uuid: filters.category_uuid,
    },
  }),

  ...(filters.product_type_uuid !== undefined && {
    product_type: {
      uuid: filters.product_type_uuid,
    },
  }),
});

const create = async (data: CreateProductDTO) => {
  // Brand find
  const brand = await prisma.brands.findFirst({
    where: {
      uuid: data.brand_uuid,
      deleted_at: null,
    },
  });

  if (!brand) {
    throw new Error("Brand not found");
  }

  // Category find
  const category = await prisma.categories.findFirst({
    where: {
      uuid: data.category_uuid,
      deleted_at: null,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Product type find
  const productType = await prisma.product_types.findFirst({
    where: {
      uuid: data.product_type_uuid,
      deleted_at: null,
    },
  });

  if (!productType) {
    throw new Error("Product type not found");
  }

  return prisma.products.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      sku: data.sku,
      barcode: data.barcode ?? null,
      status: data.status ?? "active",

      brand_id: brand.id,
      category_id: category.id,
      product_type_id: productType.id,
    },

    include: {
      brand: true,
      category: true,
      product_type: true,
    },
  });
};

const findAll = (filters: ProductFilters, skip: number, take: number) => {
  return prisma.products.findMany({
    where: buildWhere(filters),

    skip,
    take,

    orderBy: {
      created_at: "desc",
    },

    include: {
      brand: true,
      category: true,
      product_type: true,
    },
  });
};

const count = (filters: ProductFilters) => {
  return prisma.products.count({
    where: buildWhere(filters),
  });
};

const findByUuid = (uuid: string) => {
  return prisma.products.findFirst({
    where: {
      uuid,
      deleted_at: null,
    },

    include: {
      brand: true,
      category: true,
      product_type: true,
    },
  });
};

const update = async (uuid: string, data: UpdateProductDTO) => {
  // Existing product
  const existingProduct = await findByUuid(uuid);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let brandId = existingProduct.brand_id;
  let categoryId = existingProduct.category_id;
  let productTypeId = existingProduct.product_type_id;

  // Update brand if sent
  if (data.brand_uuid !== undefined) {
    const brand = await prisma.brands.findFirst({
      where: {
        uuid: data.brand_uuid,
        deleted_at: null,
      },
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    brandId = brand.id;
  }

  // Update category if sent
  if (data.category_uuid !== undefined) {
    const category = await prisma.categories.findFirst({
      where: {
        uuid: data.category_uuid,
        deleted_at: null,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    categoryId = category.id;
  }

  // Update product type if sent
  if (data.product_type_uuid !== undefined) {
    const productType = await prisma.product_types.findFirst({
      where: {
        uuid: data.product_type_uuid,
        deleted_at: null,
      },
    });

    if (!productType) {
      throw new Error("Product type not found");
    }

    productTypeId = productType.id;
  }

  const { brand_uuid, category_uuid, product_type_uuid, ...productFields } =
    data;

  return prisma.products.update({
    where: {
      uuid,
    },

    data: {
      ...productFields,

      brand_id: brandId,
      category_id: categoryId,
      product_type_id: productTypeId,
    },

    include: {
      brand: true,
      category: true,
      product_type: true,
    },
  });
};

const softDelete = (uuid: string) => {
  return prisma.products.update({
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
