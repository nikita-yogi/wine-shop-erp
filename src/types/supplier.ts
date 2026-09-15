import { supplierListQuerySchema } from "../validations/supplier.js";

export interface CreateSupplierInput {
  name: string;
  phone_no?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  tax?: string;
}

export interface updatedSupplierInput {
  name?: string;
  phone_no?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  tax?: string;
}
// Interface ki jagah direct type alias define kiya jo primitive string accept karega
export type supplierUuid = string;

export interface SupplierPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// export interface SupplierSuccessResponsePayload {
//   message: string;
//   meta: SupplierPagination;
// }

export interface supplierList {
  page: number;
  limit: number;

  // Filter & Search Fields
  search?: string;
  status?: "true" | "false"; // Database boolean mapping ke liye
  city?: string;
  state?: string;
}
