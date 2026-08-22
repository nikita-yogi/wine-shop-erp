/*
  Warnings:

  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_order_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier_meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `fk_audit_logs_store`;

-- DropForeignKey
ALTER TABLE `customer_meta` DROP FOREIGN KEY `fk_customer_meta_customer`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `fk_order_items_batch`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `fk_order_items_order`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `fk_order_items_store_product`;

-- DropForeignKey
ALTER TABLE `order_transactions` DROP FOREIGN KEY `fk_order_transactions_order`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `fk_orders_customer`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `fk_orders_store`;

-- DropForeignKey
ALTER TABLE `purchase_order_items` DROP FOREIGN KEY `fk_purchase_order_items_batch`;

-- DropForeignKey
ALTER TABLE `purchase_order_items` DROP FOREIGN KEY `fk_purchase_order_items_order`;

-- DropForeignKey
ALTER TABLE `purchase_order_items` DROP FOREIGN KEY `fk_purchase_order_items_product`;

-- DropForeignKey
ALTER TABLE `purchase_order_transactions` DROP FOREIGN KEY `fk_purchase_order_transactions_order`;

-- DropForeignKey
ALTER TABLE `purchase_orders` DROP FOREIGN KEY `fk_purchase_orders_store`;

-- DropForeignKey
ALTER TABLE `purchase_orders` DROP FOREIGN KEY `fk_purchase_orders_supplier`;

-- DropForeignKey
ALTER TABLE `store_product_batches` DROP FOREIGN KEY `fk_store_product_batches_supplier`;

-- DropForeignKey
ALTER TABLE `supplier_meta` DROP FOREIGN KEY `fk_supplier_meta_supplier`;

-- DropIndex
DROP INDEX `fk_store_product_batches_supplier` ON `store_product_batches`;

-- DropTable
DROP TABLE `audit_logs`;

-- DropTable
DROP TABLE `customer_meta`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `order_items`;

-- DropTable
DROP TABLE `order_transactions`;

-- DropTable
DROP TABLE `orders`;

-- DropTable
DROP TABLE `purchase_order_items`;

-- DropTable
DROP TABLE `purchase_order_transactions`;

-- DropTable
DROP TABLE `purchase_orders`;

-- DropTable
DROP TABLE `supplier_meta`;

-- DropTable
DROP TABLE `suppliers`;
