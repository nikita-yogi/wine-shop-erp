import type { Request, Response } from "express";

import customerModel from "../models/customers.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getParamId } from "../utils/getParamId.js";

import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../types/customers.js";

const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateCustomerDTO;

  const customer = await customerModel.create(input);

  return sendSuccess(res, 201, customer);
});

const list = asyncHandler(async (req: Request, res: Response) => {
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
  };

  const [data, total] = await Promise.all([
    customerModel.findAll(where, skip, limit),
    customerModel.count(where),
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

  const customer = await customerModel.findByUuid(uuid);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return sendSuccess(res, 200, customer);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const uuid = getParamId(req);

  const input = req.body as UpdateCustomerDTO;

  const existing = await customerModel.findByUuid(uuid);

  if (!existing) {
    throw new ApiError(404, "Customer not found");
  }

  const customer = await customerModel.update(uuid, input);

  return sendSuccess(res, 200, customer);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const uuid = getParamId(req);

  const existing = await customerModel.findByUuid(uuid);

  if (!existing) {
    throw new ApiError(404, "Customer not found");
  }

  await customerModel.softDelete(uuid);

  return sendSuccess(res, 200, null, {
    message: "Customer removed successfully",
  });
});

export default {
  create,
  list,
  getOne,
  update,
  remove,
};