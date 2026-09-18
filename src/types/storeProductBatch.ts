export interface CreateStoreProductBatchDTO {
  store_product_uuid: string;
  batch_number: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  expiry_date?: string;
  manufacture_date?: string;
}

export interface UpdateStoreProductBatchDTO {
  purchase_price?: number;
  selling_price?: number;
  quantity?: number;
  expiry_date?: string | null;
  manufacture_date?: string | null;
}
