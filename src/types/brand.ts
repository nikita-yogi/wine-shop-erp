import type { Status } from "@prisma/client";

export interface CreateBrandDTO {
  name: string;
  description?: string;
  status?: Status;
}

export interface UpdateBrandDTO {
  name?: string;
  description?: string | null;
  status?: Status;
}

export interface BrandFilters {
  status?: Status;
}