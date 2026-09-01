import type { Request, Response } from "express";
import storeProductBatchModel from "../models/storeProductBatch.js";
import storeModel from "../models/store.js";
import productModel from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getParamId } from "../utils/getParamId.js";
import type { CreateStoreProductBatchDTO, UpdateStoreProductBatchDTO } from "../types/storeProductBatch.js";

const toDate = (v?: string | null) => (v === undefined ? undefined : v ? new Date(v) : null);

const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateStoreProductBatchDTO;

  const [store, product] = await Promise.all([
    storeModel.findByUuid(input.store_uuid),
    productModel.findByUuid(input.product_uuid),
  ]);

  if (!store) throw new ApiError(404, "Store not found");
  if (!product) throw new ApiError(404, "Product not found");

  const batch = await storeProductBatchModel.create(store.id, product.id, {
    batch_number: input.batch_number,
    purchase_price: input.purchase_price,
    selling_price: input.selling_price,
    tax_rate: input.tax_rate,
    batch_quantity: input.batch_quantity,
    expiry_date: toDate(input.expiry_date) ?? null,
    manufacture_date: toDate(input.manufacture_date) ?? null,
  });

  return sendSuccess(res, 201, batch);
});

const list = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query;
  const where = {
    deleted_at: null,
    ...(typeof q.store_uuid === "string" && { store: { uuid: q.store_uuid } }),
    ...(typeof q.product_uuid === "string" && { product: { uuid: q.product_uuid } }),
    ...(typeof q.batch_number === "string" && { batch_number: { contains: q.batch_number } }),
    ...(q.expired === "true" && { expiry_date: { lt: new Date() } }),
  };

  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    storeProductBatchModel.findAll(where, skip, limit),
    storeProductBatchModel.count(where),
  ]);

  return sendSuccess(res, 200, data, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

const getOne = asyncHandler(async (req: Request, res: Response) => {
  const batch = await storeProductBatchModel.findByUuid(getParamId(req));
  if (!batch) throw new ApiError(404, "Batch not found");
  return sendSuccess(res, 200, batch);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateStoreProductBatchDTO;
  const batch = await storeProductBatchModel.update(getParamId(req), {
    ...input,
    expiry_date: toDate(input.expiry_date),
    manufacture_date: toDate(input.manufacture_date),
  });
  return sendSuccess(res, 200, batch);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  await storeProductBatchModel.softDelete(getParamId(req));
  return sendSuccess(res, 200, { message: "Batch removed" });
});

export default { create, list, getOne, update, remove };