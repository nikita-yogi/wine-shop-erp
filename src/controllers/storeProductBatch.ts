import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import storeProductBatchModel from "../models/storeProductBatch.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getParamId } from "../utils/getParamId.js";
import type {
  CreateStoreProductBatchDTO,
  UpdateStoreProductBatchDTO,
} from "../types/storeProductBatch.js";

const toDate = (v: string | null): Date | null => (v ? new Date(v) : null);

const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateStoreProductBatchDTO;

  


  try{
  const batch = await storeProductBatchModel.create( input.store_product_uuid, {
    batch_number: input.batch_number,
    purchase_price: input.purchase_price,
    selling_price: input.selling_price,

    quantity: input.quantity,
    expiry_date: toDate(input.expiry_date ?? null),

    manufacture_date: toDate(input.manufacture_date ?? null),
  });
  
  return sendSuccess(res, 201, batch);
}catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new ApiError(
      409,
      "Batch number already exists for this store product",
    );
  }

  throw error;
}
});

const list = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query;
  const where = {
    deleted_at: null,
    ...(typeof q.store_uuid === "string" && { store: { uuid: q.store_uuid } }),
    ...(typeof q.product_uuid === "string" && {
      product: { uuid: q.product_uuid },
    }),
    ...(typeof q.batch_number === "string" && {
      batch_number: { contains: q.batch_number },
    }),
    ...(q.expired === "true" && { expiry_date: { lt: new Date() } }),
  };

  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    storeProductBatchModel.findAll(where, skip, limit),
    storeProductBatchModel.count(where),
  ]);

  return sendSuccess(res, 200, data, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

const getOne = asyncHandler(async (req: Request, res: Response) => {
  const batch = await storeProductBatchModel.findByUuid(getParamId(req));
  if (!batch) throw new ApiError(404, "Batch not found");
  return sendSuccess(res, 200, batch);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as UpdateStoreProductBatchDTO;

  const updateData: {
    purchase_price?: number;
    selling_price?: number;
    quantity?: number;
    expiry_date?: Date | null;
    manufacture_date?: Date | null;
  } = {};

  if (input.purchase_price !== undefined) {
    updateData.purchase_price = input.purchase_price;
  }

  if (input.selling_price !== undefined) {
    updateData.selling_price = input.selling_price;
  }

  if (input.quantity !== undefined) {
    updateData.quantity = input.quantity;
  }

  if (input.expiry_date !== undefined) {
    updateData.expiry_date = toDate(input.expiry_date);
  }

  if (input.manufacture_date !== undefined) {
    updateData.manufacture_date = toDate(input.manufacture_date);
  }

  const batch = await storeProductBatchModel.update(
    getParamId(req),
    updateData,
  );

  return sendSuccess(res, 200, batch);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  await storeProductBatchModel.softDelete(getParamId(req));
  return sendSuccess(res, 200, { message: "Batch removed" });
});

export default { create, list, getOne, update, remove };
