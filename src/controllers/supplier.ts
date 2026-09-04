import { supplierModel } from "../models/supplier.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getUuidParam } from "../utils/getUuidParam.js";

//creat
export async function createSupplierHandler(req: Request, res: Response) {
  const supplier = await supplierModel.createSupplier(req.body);
  if (!supplier) {
    throw new ApiError(400, "Failed to create supplier");
  }
  return sendSuccess(res, 201, supplier, {
    message: "Supplier created successfully",
  });
}

//  Get Supplier By Uuid
export async function getSupplierByUuid(req: Request, res: Response) {
  const uuid = getUuidParam(req);

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
  const uuid = getUuidParam(req);

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
  const uuid = getUuidParam(req);

  const existing = await supplierModel.findByUuid(uuid);
  if (!existing) {
    throw new ApiError(404, "Supplier not found");
  }

  await supplierModel.softDelete(uuid);
  return sendSuccess(res, 200, null, {
    message: "Supplier deleted successfully",
  });
}
