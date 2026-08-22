import type { Request, Response, NextFunction } from "express";
import storeModel from "../models/store.ts";
import { ApiError } from "../utils/ApiError.js";

import type {
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreFilters,
  PaginationParams,
} from "../types/store.js";

const VALID_STATUSES = [
  "open",
  "closed",
  "suspended",
  "license_expired",
];

/**
 * Convert route param into a clean UUID string.
 */
const getUuidParam = (req: Request): string => {
  const raw = req.params.uuid;
  const uuid = Array.isArray(raw) ? raw[0] : raw;

  if (!uuid) {
    throw new ApiError(400, "uuid param is required");
  }

  return uuid;
};

/**
 * Handle Prisma unique constraint errors.
 */
const handleUniqueError = (error: unknown): never => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    const field =
      "meta" in error &&
      error.meta &&
      typeof error.meta === "object" &&
      "target" in error.meta &&
      Array.isArray(error.meta.target)
        ? error.meta.target[0] ?? "field"
        : "field";

    throw new ApiError(
         409,
      `Store with this ${field} already exists`
     
    );
  }

  throw error;
};

/**
 * CREATE STORE
 */
const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body as CreateStoreDTO;

    // Business rule
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const store = await storeModel.create({
      ...input,
      status: input.status ?? "open",
    });

    return res.status(201).json({
      success: true,
      data: store,
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
 * LIST STORES
 */
const list = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: StoreFilters = {
      status: req.query.status as string | undefined,
      city: req.query.city as string | undefined,
    };

    const pagination: PaginationParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    // Business rule: pagination limits
    const page = Math.max(1, pagination.page || 1);

    const limit = Math.min(
      100,
      Math.max(1, pagination.limit || 20)
    );

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      storeModel.findAll(filters, skip, limit),
      storeModel.count(filters),
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
 * GET SINGLE STORE
 */
const getStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = getUuidParam(req);

    const store = await storeModel.findByUuid(uuid);

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    return res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE STORE
 */
const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = getUuidParam(req);
    const input = req.body as UpdateStoreDTO;

    // Check store exists
    const existingStore = await storeModel.findByUuid(uuid);

    if (!existingStore) {
      throw new ApiError(404, "Store not found");
    }

    // Business rule
    if (input.status && !VALID_STATUSES.includes(input.status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const store = await storeModel.update(uuid, input);

    return res.status(200).json({
      success: true,
      data: store,
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
 * DELETE STORE
 */
const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = getUuidParam(req);

    // Check store exists
    const existingStore = await storeModel.findByUuid(uuid);

    if (!existingStore) {
      throw new ApiError(404, "Store not found");
    }

    await storeModel.softDelete(uuid);

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getStore,
  update,
  remove,
};