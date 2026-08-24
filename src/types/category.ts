import type { Status } from "@prisma/client";

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  status?: Status;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string | null;
  status?: Status;
}

export interface CategoryFilters {
  status?: Status;
}