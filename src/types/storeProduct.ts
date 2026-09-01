export interface CreateStoreProductDTO {
  store_uuid: string ;
  product_uuid: string;
  stock?: number;
}

export interface UpdateStoreProductDTO {
  stock: number;
}

export interface StoreProductFilters {
  store_uuid?: string;
  product_uuid?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}