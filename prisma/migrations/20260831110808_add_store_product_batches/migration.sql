-- CreateTable
CREATE TABLE `store_product_batches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `batch_number` VARCHAR(100) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `purchase_price` DECIMAL(12, 2) NOT NULL,
    `selling_price` DECIMAL(12, 2) NOT NULL,
    `tax_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `batch_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `expiry_date` DATE NULL,
    `manufacture_date` DATE NULL,
    `supplier_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `store_product_batches_uuid_key`(`uuid`),
    INDEX `fk_store_product_batches_product`(`product_id`),
    INDEX `fk_store_product_batches_store`(`store_id`),
    INDEX `store_product_batches_batch_number_idx`(`batch_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `store_product_batches` ADD CONSTRAINT `fk_store_product_batches_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_product_batches` ADD CONSTRAINT `fk_store_product_batches_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
