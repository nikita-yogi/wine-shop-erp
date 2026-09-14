export interface PurchaseOrderItemInput {
  product_uuid: string;
  quantity: number;
  unit_cost: number;
  unit_per_pack?: number;
  base_quantity?: number;
}
export type purchaseUuid = string;

export interface CreatePurchaseOrderInput {
  supplier_uuid: string;
  store_uuid: string;
  purchase_date: string;
  discount?: number;
  tax_amount?: number;
  payment_method?: string;
  items: PurchaseOrderItemInput[];
}
export interface PurchaseOrderPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PurchaseOrderList {
  page: number;
  limit: number;

  // Filter & Search Fields
  supplier_uuid?: string;
  store_uuid?: string;
  status?: string; // Database boolean mapping ke liye
  from_date?:string;
  to_date?:string;
}
