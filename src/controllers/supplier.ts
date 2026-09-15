import { supplierModel } from "../models/supplier.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getUuidParam } from "../utils/getUuidParam.js";
import type {
  supplierList,
  SupplierPagination 
} from "../types/supplier.js";
import type { Prisma } from "@prisma/client";

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
// Get All Suppliers (Paginated, Filtered & Searchable) only store A,
export async function listSupplier(req: Request, res: Response) {
  // console.log("req.query: ", res.locals.query);
  const query = res.locals.query as supplierList;
  const { page, limit, search, status, city, state } = query;

  //step 2.
  const where: Prisma.suppliersWhereInput = {
    deleted_at: null,
    ...(status !== undefined && { status: status === "true" }),
    ...(city && { city: { contains: city } }),
    ...(state && { state: { contains: state } }),
    // ...(store_uuid && {
    //   store: {
    //     uuid: store_uuid,
    //   },
    ...(search && {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone_no: { contains: search } },
      ],
    }),
  };
//step 3.
  const skip = (page - 1) * limit;

  //step4.
  const [data, total] = await Promise.all([
    supplierModel. findAllSupplier(where, skip, limit),
    supplierModel.count(where),
  ]);

  // Step E: Construct predictable API metadata boundaries
  const responseMeta: SupplierPagination  = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    
  };


  return sendSuccess(res, 200, data,responseMeta);
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
