import prisma from "../config/prisma.js";

import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../types/customers.js";

const customerModel = {
    
  create: (input: CreateCustomerDTO) => {
  return prisma.customers.create({
    data: {
      name: input.name,
      phone_no: input.phone_no,

      ...(input.email !== undefined && {
        email: input.email,
      }),

      ...(input.dob !== undefined && {
        dob: new Date(input.dob),
      }),

      ...(input.address !== undefined && {
        address: input.address,
      }),

      ...(input.city !== undefined && {
        city: input.city,
      }),

      ...(input.state !== undefined && {
        state: input.state,
      }),
    },
  });
},

  findByUuid: (uuid: string) => {
    return prisma.customers.findFirst({
      where: {
        uuid,
        deleted_at: null,
      },
    });
  },

  findAll: (
    where: {
      deleted_at: null;
    },
    skip: number,
    take: number,
  ) => {
    return prisma.customers.findMany({
      where,
      skip,
      take,
      orderBy: {
        created_at: "desc",
      },
    });
  },

  count: (where: {
    deleted_at: null;
  }) => {
    return prisma.customers.count({
      where,
    });
  },

  update: (uuid: string, input: UpdateCustomerDTO) => {
    return prisma.customers.update({
      where: {
        uuid,
      },
      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),

        ...(input.phone_no !== undefined && {
          phone_no: input.phone_no,
        }),

        ...(input.email !== undefined && {
          email: input.email,
        }),

        ...(input.dob !== undefined && {
          dob: new Date(input.dob),
        }),

        ...(input.address !== undefined && {
          address: input.address,
        }),

        ...(input.city !== undefined && {
          city: input.city,
        }),

        ...(input.state !== undefined && {
          state: input.state,
        }),
      },
    });
  },

  softDelete: (uuid: string) => {
    return prisma.customers.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  },
};

export default customerModel;