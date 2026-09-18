import prisma from "../config/prisma.js";
import type {
  CreatePurchaseOrderInput,
  purchaseUuid,
} from "../types/purchaseOrder.js";
import type { Prisma, purchase_orders_status } from "@prisma/client";

export const purchaseOrderModel = {
  createWithItems: (data: CreatePurchaseOrderInput) => {
    const itemsWithSubtotal: Prisma.purchase_order_itemsCreateWithoutPurchase_ordersInput[] =
      data.items.map((item) => ({
        // product_id ki jagah relation connect
        products: {
          connect: {
            uuid: item.product_uuid,
          },
        },
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        ...(item.unit_per_pack !== undefined && {
          unit_per_pack: item.unit_per_pack,
        }),
        ...(item.base_quantity !== undefined && {
          base_quantity: item.base_quantity,
        }),

        subtotal: item.quantity * item.unit_cost,
      }));
    //SBTOTAL ALL ITEMS
    const subtotal = itemsWithSubtotal.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );
    // finalAmount
    const finalAmount =
      subtotal + (data.tax_amount ?? 0) - (data.discount ?? 0);

    return prisma.purchase_orders.create({
      data: {
        // supplier_uuid: data.supplier_uuid,
        // store_uuid: data.store_uuid,

        suppliers: {
          connect: { uuid: data.supplier_uuid }, //  supplier_id ki jagah relation connect
        },
        stores: {
          connect: { uuid: data.store_uuid }, //  store_id ki jagah relation connect
        },
        purchase_date: new Date(data.purchase_date),

        subtotal,
        amount: subtotal,
        final_amount: finalAmount,

        ...(data.discount !== undefined && {
          discount: data.discount,
        }),
        ...(data.tax_amount !== undefined && {
          tax_amount: data.tax_amount,
        }),
        ...(data.payment_method !== undefined && {
          payment_method: data.payment_method,
        }),

        purchase_order_items: {
          create: itemsWithSubtotal,
        },
      },
      include: {
        purchase_order_items: true, // response mein items bhi dikhein
      },
    });
  },

  findByUuid: (uuid: purchaseUuid) => {
    return prisma.purchase_orders.findFirst({
      where: { uuid: uuid, deleted_at: null },
      include: {
        purchase_order_items: {
          where: { deleted_at: null },
          include: {
            products: { select: { name: true, uuid: true } },
          },
        },
        suppliers: { select: { name: true, uuid: true } },
        stores: { select: { name: true, uuid: true } },
      },
    });
  },

  findAllList: (
    where: Prisma.purchase_ordersWhereInput,
    skip: number,
    take: number,
  ) => {
    return prisma.purchase_orders.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: "desc" },
      include: {
        suppliers: { select: { name: true, uuid: true } },
        stores: { select: { name: true, uuid: true } },
      },
    });
  },
  count: (where: Prisma.purchase_ordersWhereInput) => {
    return prisma.purchase_orders.count({
      where,
    });
  },

  updateStatus: (uuid: string, status: purchase_orders_status) => {   // string ki jagah enum type
  return prisma.purchase_orders.update({
    where: { uuid },
    data: { status },
    include: {
      purchase_order_items: { where: { deleted_at: null } },
      suppliers: { select: { name: true, uuid: true } },
      stores: { select: { name: true, uuid: true } },
    },
  });
},
};
