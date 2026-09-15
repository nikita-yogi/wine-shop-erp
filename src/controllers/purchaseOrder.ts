import { purchaseOrderModel } from "../models/purchaseOrder.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/sendSuccess.js";
import { getUuidParam } from "../utils/getUuidParam.js";
import type {
  PurchaseOrderList,
  PurchaseOrderPagination,
} from "../types/purchaseOrder.js";
import type { Prisma } from "@prisma/client";

//PURCHASE ORDER

export async function createpurchaseOrder(req: Request, res: Response) {
  const purchaseOrder = await purchaseOrderModel.createWithItems(req.body);

  if (!purchaseOrder) {
    throw new ApiError(400, "Failed to create purchaseOrder");
  }
  return sendSuccess(res, 201, purchaseOrder, {
    message: "purchaseOrder created successfully",
  });
}

export async function getpurchaseOrder(req: Request, res: Response) {
  const uuid = getUuidParam(req);

  const po = await purchaseOrderModel.findByUuid(uuid);

  if (!po) {
    throw new ApiError(404, "Purchase order not found");
  }
  return sendSuccess(res, 200, po, {
    message: "purchaseOrder fetched successfully",
  });
}

// Get All puchage ooder alll(Paginated, Filtered & Searchable) only store A,
export async function purchaseOrderListHandler(req: Request, res: Response) {
  const query = res.locals.query as PurchaseOrderList;
  const { page, limit, status, supplier_uuid, store_uuid, from_date, to_date } = query;

  //step 1
  const where: Prisma.purchase_ordersWhereInput = {
    deleted_at: null,
    ...(status && { status }),
    ...(supplier_uuid && { supplier_uuid }),
    ...(store_uuid && { store_uuid }),
    ...((from_date || to_date) && {
      purchase_date: {
        ...(from_date && { gte: new Date(from_date) }),
        ...(to_date && { lte: new Date(to_date) }),
      },
    }),
  };

  //step 2.
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    purchaseOrderModel.findAllList(where, skip, limit),
    purchaseOrderModel.count(where),
  ]);

  const responseMeta: PurchaseOrderPagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
  return sendSuccess(res, 200, data, responseMeta);
}
