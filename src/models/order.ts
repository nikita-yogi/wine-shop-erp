import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

const orderModel = {
  findStoreByUuid: (uuid: string) => {
    return prisma.stores.findUnique({
      where: {
        uuid,
      },
      select: {
        id: true,
        uuid: true,
      },
    });
  },

  findCustomerByUuid: (uuid: string) => {
    return prisma.customers.findUnique({
      where: {
        uuid,
      },
      select: {
        id: true,
        uuid: true,
      },
    });
  },

  create: async (
    storeId: number,
    customerId: number | null,
    orderDate: Date,
    paymentMethod: string | undefined,
    items: {
      batch_uuid: string;
      store_product_uuid: string;
      quantity: number;
    }[],
  ) => {
    return prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);
      let taxAmount = new Prisma.Decimal(0);
      let finalAmount = new Prisma.Decimal(0);

      const orderItems = [];

      for (const item of items) {
        const batch = await tx.store_product_batches.findUnique({
          where: {
            uuid: item.batch_uuid,
          },
        });

        if (!batch) {
          throw new Error(`Batch not found: ${item.batch_uuid}`);
        }

        const storeProduct = await tx.store_products.findUnique({
          where: {
            uuid: item.store_product_uuid,
          },
        });

        if (!storeProduct) {
          throw new Error(
            `Store product not found: ${item.store_product_uuid}`,
          );
        }

        if (batch.store_id !== storeId) {
          throw new Error("Batch does not belong to this store");
        }

        if (storeProduct.store_id !== storeId) {
          throw new Error("Store product does not belong to this store");
        }

        if (batch.product_id !== storeProduct.product_id) {
          throw new Error("Batch and store product do not match");
        }

        const quantity = new Prisma.Decimal(item.quantity);

        if (batch.batch_quantity.lessThan(quantity)) {
          throw new Error(
            `Insufficient stock for batch ${item.batch_uuid}`,
          );
        }

        const itemSubtotal = batch.selling_price.mul(quantity);

        const itemTax = itemSubtotal
          .mul(batch.tax_rate)
          .div(100);

        const itemFinalAmount = itemSubtotal.add(itemTax);

        subtotal = subtotal.add(itemSubtotal);
        taxAmount = taxAmount.add(itemTax);
        finalAmount = finalAmount.add(itemFinalAmount);

        orderItems.push({
          batch_id: batch.id,
          store_product_id: storeProduct.id,
          quantity,
          unit_price: batch.selling_price,
          subtotal: itemSubtotal,
          discount: new Prisma.Decimal(0),
          final_amount: itemFinalAmount,
        });
      }

      const order = await tx.orders.create({
        data: {
          customer_id: customerId,
          store_id: storeId,
          order_date: orderDate,
          amount: subtotal,
          subtotal,
          final_amount: finalAmount,
          discount: new Prisma.Decimal(0),
          tax_amount: taxAmount,
          status: "COMPLETED",
          payment_method: paymentMethod,
          order_items: {
            create: orderItems,
          },
        },
        include: {
          order_items: true,
        },
      });

      for (const item of items) {
        const updated = await tx.store_product_batches.updateMany({
          where: {
            uuid: item.batch_uuid,
            store_id: storeId,
            batch_quantity: {
              gte: new Prisma.Decimal(item.quantity),
            },
          },
          data: {
            batch_quantity: {
              decrement: new Prisma.Decimal(item.quantity),
            },
          },
        });

        if (updated.count !== 1) {
          throw new Error(
            `Unable to update stock for batch ${item.batch_uuid}`,
          );
        }
      }

      return order;
    });
  },
};

export default orderModel;