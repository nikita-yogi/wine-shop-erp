import type { Request, Response } from "express";

import storeProductModel from "../models/storeProduct.js";
import storeModel from "../models/store.js";
import productModel from "../models/product.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getParamId } from "../utils/getParamId.js";

import type {
  CreateStoreProductDTO,
  UpdateStoreProductDTO,
} from "../types/storeProduct.js";

const create = asyncHandler(async (req: Request, res: Response) => {
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
  );

  return sendSuccess(res, 201, storeProduct);
});

const list = asyncHandler(async (req: Request, res: Response) => {
  const store_uuid =
    typeof req.query.store_uuid === "string"
      ? req.query.store_uuid
      : undefined;

  const product_uuid =
    typeof req.query.product_uuid === "string"
      ? req.query.product_uuid
      : undefined;

  const page =
    typeof req.query.page === "string"
      ? Math.max(Number(req.query.page), 1)
      : 1;

  const limit =
    typeof req.query.limit === "string"
      ? Math.min(Math.max(Number(req.query.limit), 1), 100)
      : 20;

  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null as null,
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

  const [data, total] = await Promise.all([
    storeProductModel.findAll(where, skip, limit),
    storeProductModel.count(where),
  ]);

  return sendSuccess(res, 200, data, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

const getOne = asyncHandler(async (req: Request, res: Response) => {
  const uuid = getParamId(req);

  const storeProduct = await storeProductModel.findByUuid(uuid);

  if (!storeProduct) {
    throw new ApiError(404, "Store product not found");
  }

  return sendSuccess(res, 200, storeProduct);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const uuid = getParamId(req);

  const input = req.body as UpdateStoreProductDTO;

  const existing = await storeProductModel.findByUuid(uuid);

  if (!existing) {
    throw new ApiError(404, "Store product not found");
  }

  const storeId = input.store_uuid
    ? (await storeModel.findByUuid(input.store_uuid))?.id
    : existing.store_id;

  const productId = input.product_uuid
    ? (await productModel.findByUuid(input.product_uuid))?.id
    : existing.product_id;

  if (storeId === undefined) {
    throw new ApiError(404, "Store not found");
  }

  if (productId === undefined) {
    throw new ApiError(404, "Product not found");
  }

  const storeProduct = await storeProductModel.update(
    uuid,
    storeId,
    productId,
  );

  return sendSuccess(res, 200, storeProduct);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const uuid = getParamId(req);

  const existing = await storeProductModel.findByUuid(uuid);

  if (!existing) {
    throw new ApiError(404, "Store product not found");
  }

  await storeProductModel.softDelete(uuid);

  return sendSuccess(res, 200, null, {
    message: "Store product removed successfully",
  });
});

export default {
  create,
  list,
  getOne,
  update,
  remove,
};