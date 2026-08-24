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

export interface UpdateStoreDTO
  extends Omit<Partial<CreateStoreDTO>, "expiry_date"> {
  expiry_date?: string | null;
}

export interface StoreFilters {
  city?: string;
  status?: stores_status;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
