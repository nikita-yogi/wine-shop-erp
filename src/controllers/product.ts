import type { Request, Response, NextFunction } from "express";

import productModel from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";

import type { Status } from "@prisma/client";

import type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "../types/product.js";

const getSingleQueryValue = (req: Request, key: string): string | undefined => {
  const value = req.query[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, `${key} must be a single value`);
  }

  return value;
};

const getPositiveIntegerQuery = (
  req: Request,
  key: "page" | "limit",
  defaultValue: number,
): number => {
  const value = getSingleQueryValue(req, key);

  if (value === undefined) {
    return defaultValue;
  }

  if (!/^\d+$/.test(value) || Number(value) < 1) {
    throw new ApiError(400, `${key} must be a positive integer`);
  }

  return Number(value);
};

const getUuidParam = (req: Request): string => {
  const raw = req.params.uuid;

  const uuid = Array.isArray(raw) ? raw[0] : raw;

  if (!uuid) {
    throw new ApiError(400, "uuid param is required");
  }

  return uuid;
};

const handleUniqueError = (error: unknown): never => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    throw new ApiError(409, "Product with this SKU or barcode already exists");
  }

  throw error;
};

/**
 * CREATE PRODUCT
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as CreateProductDTO;

    const product = await productModel.create(input);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    try {
      handleUniqueError(error);
    } catch (handledError) {
      next(handledError);
    }
  }
};

/**
 * LIST PRODUCTS
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getSingleQueryValue(req, "status");

    const brand_uuid = getSingleQueryValue(req, "brand_uuid");

    const category_uuid = getSingleQueryValue(req, "category_uuid");

    const product_type_uuid = getSingleQueryValue(req, "product_type_uuid");

    let parsedStatus: Status | undefined;

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        throw new ApiError(400, "status must be active or inactive");
      }

      parsedStatus = status;
    }

    const filters: ProductFilters = {
      ...(parsedStatus !== undefined && {
        status: parsedStatus,
      }),

      ...(brand_uuid !== undefined && {
        brand_uuid,
      }),

      ...(category_uuid !== undefined && {
        category_uuid,
      }),

      ...(product_type_uuid !== undefined && {
        product_type_uuid,
      }),
    };

    const page = getPositiveIntegerQuery(req, "page", 1);

    const requestedLimit = getPositiveIntegerQuery(req, "limit", 20);

    const limit = Math.min(100, requestedLimit);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      productModel.findAll(filters, skip, limit),

      productModel.count(filters),
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

/**
 * GET PRODUCT BY UUID
 */
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const product = await productModel.findByUuid(uuid);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE PRODUCT
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const input = req.body as UpdateProductDTO;

    const existingProduct = await productModel.findByUuid(uuid);

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    const product = await productModel.update(uuid, input);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    try {
      handleUniqueError(error);
    } catch (handledError) {
      next(handledError);
    }
  }
};

/**
 * DELETE PRODUCT
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const existingProduct = await productModel.findByUuid(uuid);

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    await productModel.softDelete(uuid);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getProduct,
  update,
  remove,
};
