
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







  // // import { PrismaClient } from "@prisma/client";
// // const prisma = new PrismaClient();
// // import bcrypt from "bcrypt";

// // async function main() {
// //   // ---------------------------------------
// //   // 1. ROLES (upsert = agar hai toh skip, nahi hai toh banao)
// //   // ---------------------------------------
// //   const adminRole = await prisma.roles.upsert({
// //     where: { roleName: "admin" },
// //     update: {},
// //     create: { roleName: "admin" },
// //   });

// //   const staffRole = await prisma.roles.upsert({
// //     where: { roleName: "staff" },
// //     update: {},
// //     create: { roleName: "staff" },
// //   });

// //   console.log("Roles ready:", adminRole.roleName, staffRole.roleName);

// //   // ---------------------------------------
// //   // 2. PERMISSIONS
// //   // ---------------------------------------
// //   await prisma.permission.createMany({
// //     data: [
// //       { permissionName: "manage_users", permissionGroup: "users" },
// //       { permissionName: "view_users", permissionGroup: "users" },
// //       { permissionName: "manage_roles", permissionGroup: "users" },
// //       { permissionName: "manage_stores", permissionGroup: "stores" },
// //       { permissionName: "view_stores", permissionGroup: "stores" },
// //       { permissionName: "manage_products", permissionGroup: "products" },
// //       { permissionName: "view_products", permissionGroup: "products" },
// //       { permissionName: "manage_categories", permissionGroup: "products" },
// //       { permissionName: "manage_brands", permissionGroup: "products" },
// //       { permissionName: "manage_suppliers", permissionGroup: "suppliers" },
// //       { permissionName: "view_suppliers", permissionGroup: "suppliers" },
// //       { permissionName: "manage_inventory", permissionGroup: "inventory" },
// //       { permissionName: "view_inventory", permissionGroup: "inventory" },
// //       { permissionName: "manage_purchases", permissionGroup: "purchases" },
// //       { permissionName: "view_purchases", permissionGroup: "purchases" },
// //       { permissionName: "manage_orders", permissionGroup: "orders" },
// //       { permissionName: "view_orders", permissionGroup: "orders" },
// //       { permissionName: "manage_payments", permissionGroup: "payments" },
// //       { permissionName: "view_payments", permissionGroup: "payments" },
// //       { permissionName: "view_reports", permissionGroup: "reports" },
// //     ],
// //     skipDuplicates: true,
// //   });

// //   console.log("Permissions ready");

// //   // ---------------------------------------
// //   // 3. USERS (upsert by email)
// //   // ---------------------------------------
// //   const hashedPassword = await bcrypt.hash("Admin@123", 10);
  

// //   const adminUser = await prisma.users.upsert({
// //     where: { email: "rahul@example.com" },
// //     update: {password:hashedPassword},
// //     create: {
// //       name: "Rahul Sharma",
// //       email: "rahul@example.com",
// //       phone: "9876543210",
// //       address: "123, MI Road",
// //       city: "Jaipur",
// //       state: "Rajasthan",
// //       password: hashedPassword,
// //       date_of_birth: new Date("2000-01-15"),
// //       role_id: adminRole.id,
// //       status: "active",
// //     },
// //   });

// //   const staffHashedPassword = await bcrypt.hash("Staff@123", 10);
// //   const staffUser = await prisma.users.upsert({
// //     where: { email: "priya@example.com" },
// //     update: {password:staffHashedPassword},

// //     create: {
// //       name: "Priya Verma",
// //       email: "priya@example.com",
// //       phone: "9123456780",
// //       address: "45, Vaishali Nagar",
// //       city: "Jaipur",
// //       state: "Rajasthan",
// //       password:staffHashedPassword,
// //       dateOfBirth: new Date("1998-05-10"),
// //       roleId: staffRole.id,
// //       status: "active",
// //     },
// //   });

// //   console.log("Admin user ready:", adminUser.email);
// //   console.log("Staff user ready:", staffUser.email);

// //   // ---------------------------------------
// //   // 4. USER_META
// //   // ---------------------------------------
// //   const existingMeta = await prisma.user_meta.findFirst({
// //     where: { user_id: adminUser.id, metaKey: "preferred_language" },
// //   });

// //   if (!existingMeta) {
// //     await prisma.user_meta.create({
// //       data: {
// //         user_id: adminUser.id,
// //         meta_key: "preferred_language",
// //          meta_value: "Hindi",
// //       },
// //     });
// //     console.log("User meta created");
// //   } else {
// //     console.log("User meta already exists, skipped");
// //   }

// //   // ---------------------------------------
// //   // 5. ADMIN KO SAARI PERMISSIONS DO
// //   // ---------------------------------------
// //   const allPermissions = await prisma.permission.findMany();

// //   for (const perm of allPermissions) {
// //     const existing = await prisma.user_permissions.findFirst({
// //       where: { user_id: adminUser.id, permissionId: perm.id },
// //     });

// //     if (!existing) {
// //       await prisma.user_permissions.create({
// //         data: {
// //           user_id: adminUser.id,
// //           permission_id: perm.id,
// //         },
// //       });
// //     }
// //   }

// //   console.log(`Admin ko ${allPermissions.length} permissions assign ho gayi`);

// //   // ---------------------------------------
// //   // 6. USER SESSION (login session banao admin ke liye)
// //   // ---------------------------------------
// //   const existingSession = await prisma.session.findFirst({
// //     where: { user_id: adminUser.id, isActive: true },
// //   });

// //   if (!existingSession) {
// //     const session = await prisma.session.create({
// //       data: {
// //         user_id: adminUser.id,
// //         session_token: `temp_token_${Date.now()}`, // real app mein JWT ya random string use karenge
// //         ip_address: "127.0.0.1",
// //         user_agent: "Mozilla/5.0 (Test Seed Script)",
// //         is_active: true,
// //         expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din baad expire
// //       },
// //     });
// //     console.log("Session created:", session.session_token);
// //   } else {
// //     console.log("Active session already exists, skipped");
// //   }



// // }

// // main()
// //   .catch((e) => console.error(e))
// //   .finally(async () => await prisma.$disconnect());


// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   // ---------------------------------------
//   // 1. ROLES
//   // ---------------------------------------
//   const adminRole = await prisma.roles.upsert({
//     where: { name: "admin" },
//     update: {},
//     create: { name: "admin" },
//   });

//   const staffRole = await prisma.roles.upsert({
//     where: { name: "staff" },
//     update: {},
//     create: { name: "staff" },
//   });

//   console.log("Roles ready:", adminRole.name, staffRole.name);

//   // ---------------------------------------
//   // 2. PERMISSIONS
//   // ---------------------------------------
//   await prisma.permission.createMany({
//     data: [
//       { name: "manage_users", group: "users" },
//       { name: "view_users", group: "users" },
//       { name: "manage_roles", group: "users" },
//       { name: "manage_stores", group: "stores" },
//       { name: "view_stores", group: "stores" },
//       { name: "manage_products", group: "products" },
//       { name: "view_products", group: "products" },
//       { name: "manage_categories", group: "products" },
//       { name: "manage_brands", group: "products" },
//       { name: "manage_suppliers", group: "suppliers" },
//       { name: "view_suppliers", group: "suppliers" },
//       { name: "manage_inventory", group: "inventory" },
//       { name: "view_inventory", group: "inventory" },
//       { name: "manage_purchases", group: "purchases" },
//       { name: "view_purchases", group: "purchases" },
//       { name: "manage_orders", group: "orders" },
//       { name: "view_orders", group: "orders" },
//       { name: "manage_payments", group: "payments" },
//       { name: "view_payments", group: "payments" },
//       { name: "view_reports", group: "reports" },
//     ],
//     skipDuplicates: true,
//   });

//   console.log("Permissions ready");

//   // ---------------------------------------
//   // 3. USERS
//   // ---------------------------------------
//   const hashedPassword = await bcrypt.hash("Admin@123", 10);

//   const adminUser = await prisma.users.upsert({
//     where: { email: "rahul@example.com" },
//     update: { password: hashedPassword },
//     create: {
//       name: "Rahul Sharma",
//       email: "rahul@example.com",
//       phone: "9876543210",
//       address: "123, MI Road",
//       city: "Jaipur",
//       state: "Rajasthan",
//       password: hashedPassword,
//       date_of_birth: new Date("2000-01-15"),
//       role_id: adminRole.id,
//       status: "active",
//     },
//   });

//   const staffHashedPassword = await bcrypt.hash("Staff@123", 10);

//   const staffUser = await prisma.users.upsert({
//     where: { email: "priya@example.com" },
//     update: { password: staffHashedPassword },
//     create: {
//       name: "Priya Verma",
//       email: "priya@example.com",
//       phone: "9123456780",
//       address: "45, Vaishali Nagar",
//       city: "Jaipur",
//       state: "Rajasthan",
//       password: staffHashedPassword,
//       date_of_birth: new Date("1998-05-10"),
//       role_id: staffRole.id,
//       status: "active",
//     },
//   });

//   console.log("Admin user ready:", adminUser.email);
//   console.log("Staff user ready:", staffUser.email);

//   // ---------------------------------------
//   // 4. USER_META
//   // ---------------------------------------
//   const existingMeta = await prisma.user_meta.findFirst({
//     where: { user_id: adminUser.id, meta_key: "preferred_language" },
//   });

//   if (!existingMeta) {
//     await prisma.user_meta.create({
//       data: {
//         user_id: adminUser.id,
//         meta_key: "preferred_language",
//         meta_value: "Hindi",
//       },
//     });
//     console.log("User meta created");
//   } else {
//     console.log("User meta already exists, skipped");
//   }

//   // ---------------------------------------
//   // 5. ADMIN KO SAARI PERMISSIONS DO
//   // ---------------------------------------
//   const allPermissions = await prisma.permission.findMany();

//   for (const perm of allPermissions) {
//     const existing = await prisma.user_permissions.findFirst({
//       where: { user_id: adminUser.id, permission_id: perm.id },
//     });

//     if (!existing) {
//       await prisma.user_permissions.create({
//         data: {
//           user_id: adminUser.id,
//           permission_id: perm.id,
//         },
//       });
//     }
//   }

//   console.log(`Admin ko ${allPermissions.length} permissions assign ho gayi`);

//   // ---------------------------------------
//   // 6. USER SESSION
//   // ---------------------------------------
//   const existingSession = await prisma.session.findFirst({
//     where: { user_id: adminUser.id, is_active: true },
//   });

//   if (!existingSession) {
//     const session = await prisma.session.create({
//       data: {
//         user_id: adminUser.id,
//         session_token: `temp_token_${Date.now()}`,
//         ip_address: "127.0.0.1",
//         user_agent: "Mozilla/5.0 (Test Seed Script)",
//         is_active: true,
//         expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       },
//     });
//     console.log("Session created:", session.session_token);
//   } else {
//     console.log("Active session already exists, skipped");
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());




// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// import bcrypt from "bcrypt";

// async function main() {
//   // ---------------------------------------
//   // 1. ROLES (upsert = agar hai toh skip, nahi hai toh banao)
//   // ---------------------------------------
//   const adminRole = await prisma.roles.upsert({
//     where: { roleName: "admin" },
//     update: {},
//     create: { roleName: "admin" },
//   });

//   const staffRole = await prisma.roles.upsert({
//     where: { roleName: "staff" },
//     update: {},
//     create: { roleName: "staff" },
//   });

//   console.log("Roles ready:", adminRole.roleName, staffRole.roleName);

//   // ---------------------------------------
//   // 2. PERMISSIONS
//   // ---------------------------------------
//   await prisma.permission.createMany({
//     data: [
//       { permissionName: "manage_users", permissionGroup: "users" },
//       { permissionName: "view_users", permissionGroup: "users" },
//       { permissionName: "manage_roles", permissionGroup: "users" },
//       { permissionName: "manage_stores", permissionGroup: "stores" },
//       { permissionName: "view_stores", permissionGroup: "stores" },
//       { permissionName: "manage_products", permissionGroup: "products" },
//       { permissionName: "view_products", permissionGroup: "products" },
//       { permissionName: "manage_categories", permissionGroup: "products" },
//       { permissionName: "manage_brands", permissionGroup: "products" },
//       { permissionName: "manage_suppliers", permissionGroup: "suppliers" },
//       { permissionName: "view_suppliers", permissionGroup: "suppliers" },
//       { permissionName: "manage_inventory", permissionGroup: "inventory" },
//       { permissionName: "view_inventory", permissionGroup: "inventory" },
//       { permissionName: "manage_purchases", permissionGroup: "purchases" },
//       { permissionName: "view_purchases", permissionGroup: "purchases" },
//       { permissionName: "manage_orders", permissionGroup: "orders" },
//       { permissionName: "view_orders", permissionGroup: "orders" },
//       { permissionName: "manage_payments", permissionGroup: "payments" },
//       { permissionName: "view_payments", permissionGroup: "payments" },
//       { permissionName: "view_reports", permissionGroup: "reports" },
//     ],
//     skipDuplicates: true,
//   });

//   console.log("Permissions ready");

//   // ---------------------------------------
//   // 3. USERS (upsert by email)
//   // ---------------------------------------
//   const hashedPassword = await bcrypt.hash("Admin@123", 10);
  

//   const adminUser = await prisma.users.upsert({
//     where: { email: "rahul@example.com" },
//     update: {password:hashedPassword},
//     create: {
//       name: "Rahul Sharma",
//       email: "rahul@example.com",
//       phone: "9876543210",
//       address: "123, MI Road",
//       city: "Jaipur",
//       state: "Rajasthan",
//       password: hashedPassword,
//       date_of_birth: new Date("2000-01-15"),
//       role_id: adminRole.id,
//       status: "active",
//     },
//   });

//   const staffHashedPassword = await bcrypt.hash("Staff@123", 10);
//   const staffUser = await prisma.users.upsert({
//     where: { email: "priya@example.com" },
//     update: {password:staffHashedPassword},

//     create: {
//       name: "Priya Verma",
//       email: "priya@example.com",
//       phone: "9123456780",
//       address: "45, Vaishali Nagar",
//       city: "Jaipur",
//       state: "Rajasthan",
//       password:staffHashedPassword,
//       dateOfBirth: new Date("1998-05-10"),
//       roleId: staffRole.id,
//       status: "active",
//     },
//   });

//   console.log("Admin user ready:", adminUser.email);
//   console.log("Staff user ready:", staffUser.email);

//   // ---------------------------------------
//   // 4. USER_META
//   // ---------------------------------------
//   const existingMeta = await prisma.user_meta.findFirst({
//     where: { user_id: adminUser.id, metaKey: "preferred_language" },
//   });

//   if (!existingMeta) {
//     await prisma.user_meta.create({
//       data: {
//         user_id: adminUser.id,
//         meta_key: "preferred_language",
//          meta_value: "Hindi",
//       },
//     });
//     console.log("User meta created");
//   } else {
//     console.log("User meta already exists, skipped");
//   }

//   // ---------------------------------------
//   // 5. ADMIN KO SAARI PERMISSIONS DO
//   // ---------------------------------------
//   const allPermissions = await prisma.permission.findMany();

//   for (const perm of allPermissions) {
//     const existing = await prisma.user_permissions.findFirst({
//       where: { user_id: adminUser.id, permissionId: perm.id },
//     });

//     if (!existing) {
//       await prisma.user_permissions.create({
//         data: {
//           user_id: adminUser.id,
//           permission_id: perm.id,
//         },
//       });
//     }
//   }

//   console.log(`Admin ko ${allPermissions.length} permissions assign ho gayi`);

//   // ---------------------------------------
//   // 6. USER SESSION (login session banao admin ke liye)
//   // ---------------------------------------
//   const existingSession = await prisma.session.findFirst({
//     where: { user_id: adminUser.id, isActive: true },
//   });

//   if (!existingSession) {
//     const session = await prisma.session.create({
//       data: {
//         user_id: adminUser.id,
//         session_token: `temp_token_${Date.now()}`, // real app mein JWT ya random string use karenge
//         ip_address: "127.0.0.1",
//         user_agent: "Mozilla/5.0 (Test Seed Script)",
//         is_active: true,
//         expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din baad expire
//       },
//     });
//     console.log("Session created:", session.session_token);
//   } else {
//     console.log("Active session already exists, skipped");
//   }



// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());