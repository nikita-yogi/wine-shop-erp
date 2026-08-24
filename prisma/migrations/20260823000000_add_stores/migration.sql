-- CreateTable
CREATE TABLE `stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `license_no` VARCHAR(100) NULL,
    `expiry_date` DATE NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `pincode` VARCHAR(10) NULL,
    `status` ENUM('open', 'closed', 'suspended', 'license_expired') NOT NULL DEFAULT 'open',
    `phone_no` VARCHAR(20) NULL,
    `email` VARCHAR(150) NULL,
    `tax_rate` DECIMAL(5, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `stores_uuid_key`(`uuid`),
    UNIQUE INDEX `stores_code_key`(`code`),
    UNIQUE INDEX `stores_license_no_key`(`license_no`),
    INDEX `idx_stores_status`(`status`),
    INDEX `idx_stores_city`(`city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
