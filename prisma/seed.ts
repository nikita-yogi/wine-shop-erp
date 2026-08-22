
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------
  // ROLES
  // ---------------------------------------
  await prisma.roles.createMany({
    data: [
      { name: "owner" },
      { name: "manager" },
      { name: "shopkeeper" },
      { name: "staff" },
      { name: "cashier" },
    ],
    skipDuplicates: true,
  });

  console.log("Roles ready");

  // ---------------------------------------
  // PERMISSIONS
  // ---------------------------------------
  await prisma.permission.createMany({
    data: [
      { name: "manage_users", group: "users" },
      { name: "view_users", group: "users" },
      { name: "manage_roles", group: "users" },
      { name: "manage_stores", group: "stores" },
      { name: "view_stores", group: "stores" },
      { name: "manage_products", group: "products" },
      { name: "view_products", group: "products" },
      { name: "manage_categories", group: "products" },
      { name: "manage_brands", group: "products" },
      { name: "manage_suppliers", group: "suppliers" },
      { name: "view_suppliers", group: "suppliers" },
      { name: "manage_inventory", group: "inventory" },
      { name: "view_inventory", group: "inventory" },
      { name: "manage_purchases", group: "purchases" },
      { name: "view_purchases", group: "purchases" },
      { name: "manage_orders", group: "orders" },
      { name: "view_orders", group: "orders" },
      { name: "manage_payments", group: "payments" },
      { name: "view_payments", group: "payments" },
      { name: "sell_product", group: "sales" },
      { name: "view_reports", group: "reports" },
    ],
    skipDuplicates: true,
  });

  console.log("Permissions ready");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());




