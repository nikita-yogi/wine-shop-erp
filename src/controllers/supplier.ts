import { success } from "zod";
import { supplierModel } from "../models/supplier.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";
// create supplier
export async function createSupplierHandler(req: Request, res: Response) {
  const supplier = await supplierModel.createSupplier(req.body);
  if (!supplier) {
    throw new ApiError(400, "Failed to create supplier");
  }
  return sendSuccess(res, 201, supplier, {
    message: "Supplier created successfully",
  });
}

// 2. Get Supplier By Uuid
export async function getSupplierByUuid(req: Request, res: Response) {
  const uuid = req.params.uuid as string;
  if (!uuid) {
    throw new ApiError(400, "supplier uuid is required");
  }

  const supplier = await supplierModel.findByUuid(uuid);
  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  return sendSuccess(res, 200, supplier, {
    message: "Supplier fetched successfully",
  });
}

// updated
export async function updatedSupplier(req: Request, res: Response) {
  const uuid = req.params.uuid as string;
  if (!uuid) {
    throw new ApiError(400, "supplier uuid is required");
  }

  const supplier = await supplierModel.findByUuid(uuid);
  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }
  const updated = await supplierModel.updatedByUuid(uuid, req.body);
  return sendSuccess(res, 200, updated, {
    message: "Supplier updated successfully",
  });
}

//  Delete Supplier
export async function deleteSupplier(req: Request, res: Response) {
  const uuid = req.params.uuid as string;
  if (!uuid) {
    throw new ApiError(400, "supplier uuid is required");
  }

  const existing = await supplierModel.findByUuid(uuid);
  if (!existing) {
    throw new ApiError(404, "Supplier not found");
  }

  await supplierModel.softDelete(uuid);
  return sendSuccess(res, 200, null, {
    message: "Supplier deleted successfully",
  });
}
