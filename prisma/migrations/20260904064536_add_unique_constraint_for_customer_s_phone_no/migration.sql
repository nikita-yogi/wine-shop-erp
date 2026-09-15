/*
  Warnings:

  - You are about to drop the column `password` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id,meta_key]` on the table `customer_meta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_no]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `password`,
    ADD COLUMN `name` VARCHAR(150) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customer_meta_customer_id_meta_key_key` ON `customer_meta`(`customer_id`, `meta_key`);

-- CreateIndex
CREATE UNIQUE INDEX `customers_phone_no_key` ON `customers`(`phone_no`);
