/*
  Warnings:

  - You are about to drop the `user_branches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_branches` DROP FOREIGN KEY `user_branches_branch_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_branches` DROP FOREIGN KEY `user_branches_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_branches` DROP FOREIGN KEY `user_branches_user_id_fkey`;

-- DropTable
DROP TABLE `user_branches`;

-- CreateTable
CREATE TABLE `store_admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `store_admin_uuid_key`(`uuid`),
    INDEX `store_admin_user_id_idx`(`user_id`),
    INDEX `store_admin_store_id_idx`(`store_id`),
    INDEX `store_admin_role_id_idx`(`role_id`),
    UNIQUE INDEX `store_admin_user_id_store_id_key`(`user_id`, `store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `store_users_uuid_key`(`uuid`),
    INDEX `store_users_user_id_idx`(`user_id`),
    INDEX `store_users_store_id_idx`(`store_id`),
    INDEX `store_users_role_id_idx`(`role_id`),
    UNIQUE INDEX `store_users_user_id_store_id_key`(`user_id`, `store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `store_admin` ADD CONSTRAINT `store_admin_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_admin` ADD CONSTRAINT `store_admin_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_admin` ADD CONSTRAINT `store_admin_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_users` ADD CONSTRAINT `store_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_users` ADD CONSTRAINT `store_users_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_users` ADD CONSTRAINT `store_users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
