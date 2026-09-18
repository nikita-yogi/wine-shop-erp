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

import { purchase_orders_status } from "@prisma/client";
import { ALLOWED_STATUS_TRANSITIONS } from "../constants/purchaseOrder.js";
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
  // const where: Prisma.purchase_ordersWhereInput = {
  //   deleted_at: null,
  //   ...(status && { status }),
  //   ...(supplier_uuid && { supplier_uuid }),
  //   ...(store_uuid && { store_uuid }),
  //   ...((from_date || to_date) && {
  //     purchase_date: {
  //       ...(from_date && { gte: new Date(from_date) }),
  //       ...(to_date && { lte: new Date(to_date) }),
  //     },
  //   }),
  // };

const where: Prisma.purchase_ordersWhereInput = {
  deleted_at: null,
  ...(status && { status: status as purchase_orders_status }),   // type cast add kiya
  ...(supplier_uuid && { suppliers: { uuid: supplier_uuid } }),
  ...(store_uuid && { stores: { uuid: store_uuid } }),
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


export async function updatePurchaseOrderStatus(req: Request, res: Response) {
  const uuid = getUuidParam(req);
  const { status: newStatus } = req.body as { status: purchase_orders_status };

  const po = await purchaseOrderModel.findByUuid(uuid);
  if (!po) {
    throw new ApiError(404, "Purchase order not found");
  }

  const currentStatus = po.status;
  const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] ?? [];

  if (!allowedNext.includes(newStatus)) {
    throw new ApiError(
      409,
      `Cannot change status from "${currentStatus}" to "${newStatus}". Allowed: ${
        allowedNext.length > 0 ? allowedNext.join(", ") : "none"
      }`
    );
  }

  const updated = await purchaseOrderModel.updateStatus(uuid, newStatus);

  return sendSuccess(res, 200, updated, {
    message: `Purchase order status updated to ${newStatus}`,
  });
}

export async function cancelPurchaseOrder(req: Request, res: Response) {
  const uuid = getUuidParam(req);

  const po = await purchaseOrderModel.findByUuid(uuid);
  if (!po) {
    throw new ApiError(404, "Purchase order not found");
  }

  if (po.status === purchase_orders_status.cancelled) {
    throw new ApiError(409, "Purchase order is already cancelled");
  }

  if (po.status === purchase_orders_status.delivered) {
    throw new ApiError(409, "Cannot cancel a delivered purchase order");
  }

  const cancelled = await purchaseOrderModel.updateStatus(
    uuid,
    purchase_orders_status.cancelled
  );

  return sendSuccess(res, 200, cancelled, {
    message: "Purchase order cancelled successfully",
  });
}