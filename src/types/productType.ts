import type { Status } from "@prisma/client";

export interface CreateProductTypeDTO {
  name: string;
  volume_ml?: number;
  unit?: string;
  unit_value?: number;
  status?: Status;
}

export interface UpdateProductTypeDTO {
  name?: string;
  volume_ml?: number | null;
  unit?: string | null;
  unit_value?: number | null;
  status?: Status;
}

export interface ProductTypeFilters {
  status?: Status;
}