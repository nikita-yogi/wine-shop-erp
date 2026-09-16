import { purchase_orders_status } from "@prisma/client";

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  [purchase_orders_status.pending]: [
    purchase_orders_status.received,
    purchase_orders_status.cancelled,
  ],
  [purchase_orders_status.received]: [
    purchase_orders_status.delivered,
    purchase_orders_status.cancelled,
  ],
  [purchase_orders_status.delivered]: [],
  [purchase_orders_status.cancelled]: [],
};
