import prisma from "../config/prisma.js";
import { PrismaClient, type Prisma } from "@prisma/client";
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
  
 findAllSupplier:(where: Prisma.suppliersWhereInput,skip:number,take:number)=>{
  return prisma.suppliers.findMany({
    where,
    skip,
    take,
    orderBy:{created_at:"desc"}

  });
 },
 
count:(where:Prisma.suppliersWhereInput)=>{
  return prisma.suppliers.count({
    where
  })
},

  softDelete: (uuid:  supplierUuid) => {
    return prisma.suppliers.update({
      where: { uuid: uuid },
      data: { deleted_at: new Date() },
    });
  },
};
