import type { Request, Response, NextFunction } from "express";
import storeProductModel from "../models/storeProduct.js";
import storeModel from "../models/store.js";
import productModel from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";

import type {
  CreateStoreProductDTO,
  UpdateStoreProductDTO,
} from "../types/storeProduct.js";

const getQueryString = (req: Request, key: string): string | undefined => {
  const raw = req.query[key];

  if (raw === undefined) {
    return undefined;
  }

  if (typeof raw !== "string") {
    throw new ApiError(400, `${key} must be a single string`);
  }

  return raw;
};

const getRequiredQueryString = (req: Request, key: string): string => {
  const value = getQueryString(req, key);

  if (!value) {
    throw new ApiError(400, `${key} is required`);
  }

  return value;
};

const getPositiveIntegerQuery = (
  req: Request,
  key: "page" | "limit",
  def: number,
): number => {
  const value = req.query[key];

  if (value === undefined) {
    return def;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new ApiError(400, `${key} must be a positive integer`);
  }

  return Number(value);
};

const handlePrismaError = (error: unknown, next: NextFunction) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return next(
      new ApiError(409, "This product is already assigned to this store"),
    );
  }

  return next(error);
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as CreateStoreProductDTO;

    const [store, product] = await Promise.all([
      storeModel.findByUuid(input.store_uuid),
      productModel.findByUuid(input.product_uuid),
    ]);

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const storeProduct = await storeProductModel.create(
      store.id,
      product.id,
      input.stock ?? 0,
    );

    return res.status(201).json({
      success: true,
      data: storeProduct,
    });
  } catch (error) {
    handlePrismaError(error, next);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store_uuid = getQueryString(req, "store_uuid");

    const product_uuid = getQueryString(req, "product_uuid");

    const where = {
      deleted_at: null,

      ...(store_uuid && {
        store: {
          uuid: store_uuid,
        },
      }),

      ...(product_uuid && {
        product: {
          uuid: product_uuid,
        },
      }),
    };

    const page = getPositiveIntegerQuery(req, "page", 1);

    const limit = Math.min(100, getPositiveIntegerQuery(req, "limit", 20));

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      storeProductModel.findAll(where, skip, limit),
      storeProductModel.count(where),
    ]);

    return res.status(200).json({
      success: true,
      data,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getRequiredQueryString(req, "uuid");

    const storeProduct = await storeProductModel.findByUuid(uuid);

    if (!storeProduct) {
      throw new ApiError(404, "Store product not found");
    }

    return res.status(200).json({
      success: true,
      data: storeProduct,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getRequiredQueryString(req, "uuid");

    const { stock } = req.body as UpdateStoreProductDTO;

    const existing = await storeProductModel.findByUuid(uuid);

    if (!existing) {
      throw new ApiError(404, "Store product not found");
    }

    const storeProduct = await storeProductModel.update(uuid, stock);

    return res.status(200).json({
      success: true,
      data: storeProduct,
    });
  } catch (error) {
    handlePrismaError(error, next);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getRequiredQueryString(req, "uuid");

    const existing = await storeProductModel.findByUuid(uuid);

    if (!existing) {
      throw new ApiError(404, "Store product not found");
    }

    await storeProductModel.softDelete(uuid);

    return res.status(200).json({
      success: true,
      message: "Store product removed",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getOne,
  update,
  remove,
};
