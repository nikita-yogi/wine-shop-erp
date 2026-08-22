import type { stores_status } from "@prisma/client";

export interface CreateStoreDTO {
  name: string;
  code: string;
  license_no?: string;
  expiry_date?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status?: stores_status;
  phone_no?: string;
  email?: string;
  tax_rate?: number;   
}

export interface UpdateStoreDTO extends Partial<CreateStoreDTO> {}

export interface StoreFilters {
  city?: string;
  status?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}