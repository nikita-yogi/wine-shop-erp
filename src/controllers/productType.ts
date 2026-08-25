import type { Request, Response, NextFunction } from "express";

import productTypeModel from "../models/productType.js";
import { ApiError } from "../utils/ApiError.js";
import type { Status } from "@prisma/client";

import type {
  CreateProductTypeDTO,
  UpdateProductTypeDTO,
  ProductTypeFilters,
} from "../types/productType.js";

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
    throw new ApiError(409, "Product type with this name already exists");
  }

  throw error;
};

/**
 * CREATE PRODUCT TYPE
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as CreateProductTypeDTO;

    const productType = await productTypeModel.create(input);

    return res.status(201).json({
      success: true,
      data: productType,
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
 * LIST PRODUCT TYPES
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getSingleQueryValue(req, "status");

    let parsedStatus: Status | undefined;

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        throw new ApiError(400, "status must be active or inactive");
      }

      parsedStatus = status as Status;
    }

    const filters: ProductTypeFilters = {
      ...(parsedStatus !== undefined && {
        status: parsedStatus,
      }),
    };

    const page = getPositiveIntegerQuery(req, "page", 1);

    const requestedLimit = getPositiveIntegerQuery(req, "limit", 20);

    const limit = Math.min(100, requestedLimit);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      productTypeModel.findAll(filters, skip, limit),
      productTypeModel.count(filters),
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
 * GET PRODUCT TYPE BY UUID
 */
const getProductType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const uuid = getUuidParam(req);

    const productType = await productTypeModel.findByUuid(uuid);

    if (!productType) {
      throw new ApiError(404, "Product type not found");
    }

    return res.status(200).json({
      success: true,
      data: productType,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE PRODUCT TYPE
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const input = req.body as UpdateProductTypeDTO;

    const existingProductType = await productTypeModel.findByUuid(uuid);

    if (!existingProductType) {
      throw new ApiError(404, "Product type not found");
    }

    const productType = await productTypeModel.update(uuid, input);

    return res.status(200).json({
      success: true,
      data: productType,
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
 * DELETE PRODUCT TYPE
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const existingProductType = await productTypeModel.findByUuid(uuid);

    if (!existingProductType) {
      throw new ApiError(404, "Product type not found");
    }

    await productTypeModel.softDelete(uuid);

    return res.status(200).json({
      success: true,
      message: "Product type deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getProductType,
  update,
  remove,
};
