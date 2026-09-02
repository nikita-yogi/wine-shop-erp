import prisma from "../config/prisma.js";
import type {
  CreateSupplierInput,
  updatedSupplierInput,
  supplierUuid 
} from "../types/supplier.js";

export const supplierModel = {
  createSupplier: (data: CreateSupplierInput) => {
    return prisma.suppliers.create({ data: data });
  },

  findByUuid: (uuid: supplierUuid ) => {
    return prisma.suppliers.findFirst({
      where: {uuid : uuid, deleted_at: null },
      include: { supplier_meta: { where: { deleted_at: null } } },
    });
  },
  updatedByUuid: (uuid:  supplierUuid , data: updatedSupplierInput) => {
    return prisma.suppliers.update({
      where: {uuid : uuid },
      data,
    });
  },

  softDelete: (uuid:  supplierUuid) => {
    return prisma.suppliers.update({
      where: { uuid: uuid },
      data: { deleted_at: new Date() },
    });
  },
};
