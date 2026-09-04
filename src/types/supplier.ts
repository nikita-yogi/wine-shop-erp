

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
