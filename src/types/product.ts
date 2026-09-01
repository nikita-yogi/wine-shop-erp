import type { Status } from "@prisma/client";

export interface CreateProductDTO {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  brand_uuid: string;
  category_uuid: string;
  product_type_uuid: string;
  status?: Status;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  sku?: string;
  barcode?: string | null;
  brand_uuid?: string;
  category_uuid?: string;
  product_type_uuid?: string;
  status?: Status;
}

export interface ProductFilters {
  status?: Status;
  brand_uuid?: string;
  category_uuid?: string;
  product_type_uuid?: string;
}