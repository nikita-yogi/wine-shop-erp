export interface CreateStoreProductDTO {
  store_uuid: string ;
  product_uuid: string;
}

export interface UpdateStoreProductDTO {
  store_uuid?: string;
  product_uuid?: string;
}


export interface StoreProductFilters {
  store_uuid?: string;
  product_uuid?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}