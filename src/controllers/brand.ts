import type { Request, Response, NextFunction } from "express";

import brandModel from "../models/brand.js";
import { ApiError } from "../utils/ApiError.js";
import type { Status } from "@prisma/client";

import type {
  CreateBrandDTO,
  UpdateBrandDTO,
  BrandFilters,
} from "../types/brand.js";

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
    throw new ApiError(409, "Brand with this name already exists");
  }

  throw error;
};

/**
 * CREATE BRAND
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body as CreateBrandDTO;

    const brand = await brandModel.create({
      ...input,
    //   status: input.status ?? true,
    });

    return res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(handleUniqueError(error));
  }
};

/**
 * LIST BRANDS
 */
const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getSingleQueryValue(req, "status");

    let parsedStatus: Status | undefined;

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        throw new ApiError(400, "status must be active or inactive");
      }

      parsedStatus = status;
    }

    const filters: BrandFilters = {
      ...(parsedStatus !== undefined && {
        status: parsedStatus,
      }),
    };

    const page = getPositiveIntegerQuery(req, "page", 1);

    const requestedLimit = getPositiveIntegerQuery(req, "limit", 20);

    const limit = Math.min(100, requestedLimit);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      brandModel.findAll(filters, skip, limit),
      brandModel.count(filters),
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
 * GET BRAND BY UUID
 */
const getBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const brand = await brandModel.findByUuid(uuid);

    if (!brand) {
      throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE BRAND
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const input = req.body as UpdateBrandDTO;

    const existingBrand = await brandModel.findByUuid(uuid);

    if (!existingBrand) {
      throw new ApiError(404, "Brand not found");
    }

    const brand = await brandModel.update(uuid, input);

    return res.status(200).json({
      success: true,
      data: brand,
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
 * DELETE BRAND
 */
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uuid = getUuidParam(req);

    const existingBrand = await brandModel.findByUuid(uuid);

    if (!existingBrand) {
      throw new ApiError(404, "Brand not found");
    }

    await brandModel.softDelete(uuid);

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getBrand,
  update,
  remove,
};
