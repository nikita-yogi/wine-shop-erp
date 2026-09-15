import type { Request, Response, NextFunction } from "express";
import storeModel from "../models/store.js";
import prisma from "../config/prisma.js";

import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";


import type {
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreFilters,
  PaginationParams,
} from "../types/store.js";
import type { stores_status } from "@prisma/client";

const VALID_STATUSES = [
  "open",
  "closed",
  "suspended",
  "license_expired",
] as const;

const isStoreStatus = (value: string): value is stores_status =>
  VALID_STATUSES.includes(value as stores_status);

const getSingleQueryValue = (
  req: Request,
  key: string
): string | undefined => {
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
  defaultValue: number
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
    if (input.status && !isStoreStatus(input.status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const result = await prisma.$transaction(async (tx) => {
  const ownerRole = await tx.roles.findUnique({
    where: {
      name: "owner",
    },
  });

  if (!ownerRole) {
    throw new ApiError(500, "OWNER role not found");
  }

//   const existingStore = await tx.user_branches.findFirst({
//   where: {
//     user_id: req.user!.userId,
//     role_id: ownerRole.id,
//     deleted_at: null,
//   },
// });

// if (existingStore) {
//   throw new ApiError(409, "Owner can have only one store");
// }

  const store = await storeModel.create(
    {
      ...input,
      status: input.status ?? "open",
    },
    tx
  );

  await tx.store_admin.create({
  data: {
    user_id: req.user!.userId,
    store_id: store.id,
    role_id: ownerRole.id,
  },
});

  return store;
});

return res.status(201).json({
  success: true,
  data: result,
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
    const status = getSingleQueryValue(req, "status");
    const city = getSingleQueryValue(req, "city");

    if (status !== undefined && !isStoreStatus(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const filters: StoreFilters = {
      ...(status !== undefined && { status }),
      ...(city !== undefined && { city }),
    };

    const pagination: PaginationParams = {
      page: getPositiveIntegerQuery(req, "page", 1),
      limit: getPositiveIntegerQuery(req, "limit", 20),
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
    if (input.status && !isStoreStatus(input.status)) {
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

    // return sendSuccess(res, 201, data);




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
