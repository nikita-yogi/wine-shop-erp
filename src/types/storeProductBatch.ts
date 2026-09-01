export interface CreateStoreProductBatchDTO {
  store_uuid: string;
  product_uuid: string;
  batch_number: string ;
  purchase_price: number;
  selling_price: number;
  tax_rate?: number;
  batch_quantity: number;
  expiry_date?: string;
  manufacture_date?: string;
}

export interface UpdateStoreProductBatchDTO {
  purchase_price?: number;
  selling_price?: number;
  tax_rate?: number;
  batch_quantity?: number;
  expiry_date?: string | null;
  manufacture_date?: string | null;
}
