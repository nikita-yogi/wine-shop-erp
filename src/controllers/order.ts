import type { Request, Response } from "express";

import orderModel from "../models/order.js";
import customerModel from "../models/customers.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/sendSuccess.js";

import type { CreateOrderDTO } from "../types/order.js";

const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateOrderDTO;

  const store = await orderModel.findStoreByUuid(input.store_uuid);

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  let customerId: number | null = null;

  if (input.customer_uuid) {
    const customer = await customerModel.findByUuid(
      input.customer_uuid,
    );

    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    customerId = customer.id;
  }

  const order = await orderModel.create(
    store.id,
    customerId,
    new Date(input.order_date),
    input.payment_method,
    input.items,
  );

  return sendSuccess(res, 201, order);
});

export default {
  create,
};