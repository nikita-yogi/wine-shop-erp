-- permissions
ALTER TABLE `permissions` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `permissions` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;
ALTER TABLE `permissions` CHANGE COLUMN `permissionGroup` `group` VARCHAR(50) NULL;
ALTER TABLE `permissions` CHANGE COLUMN `permissionName` `name` VARCHAR(100) NOT NULL;

-- roles
ALTER TABLE `roles` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `roles` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;
ALTER TABLE `roles` CHANGE COLUMN `roleName` `name` VARCHAR(50) NOT NULL;

-- user_meta
ALTER TABLE `user_meta` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `user_meta` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;
ALTER TABLE `user_meta` CHANGE COLUMN `metaKey` `meta_key` VARCHAR(100) NOT NULL;
ALTER TABLE `user_meta` CHANGE COLUMN `metaValue` `meta_value` TEXT NULL;
ALTER TABLE `user_meta` CHANGE COLUMN `userId` `user_id` INTEGER NOT NULL;

-- user_permissions
ALTER TABLE `user_permissions` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `user_permissions` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;
ALTER TABLE `user_permissions` CHANGE COLUMN `permissionId` `permission_id` INTEGER NOT NULL;
ALTER TABLE `user_permissions` CHANGE COLUMN `userId` `user_id` INTEGER NOT NULL;

-- users
ALTER TABLE `users` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `users` CHANGE COLUMN `dateOfBirth` `date_of_birth` DATE NULL;
ALTER TABLE `users` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;
ALTER TABLE `users` CHANGE COLUMN `passwordHash` `password` TEXT NOT NULL;
ALTER TABLE `users` CHANGE COLUMN `roleId` `role_id` INTEGER NULL;
ALTER TABLE `users` CHANGE COLUMN `updatedAt` `updated_at` DATETIME(3) NOT NULL;

-- Table rename (data preserved)
RENAME TABLE `user_sessions` TO `session`;

-- session columns
ALTER TABLE `session` CHANGE COLUMN `userId` `user_id` INTEGER NOT NULL;
ALTER TABLE `session` CHANGE COLUMN `sessionToken` `session_token` VARCHAR(512) NOT NULL;
ALTER TABLE `session` CHANGE COLUMN `ipAddress` `ip_address` VARCHAR(45) NULL;
ALTER TABLE `session` CHANGE COLUMN `userAgent` `user_agent` TEXT NULL;
ALTER TABLE `session` CHANGE COLUMN `isActive` `is_active` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `session` CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `session` CHANGE COLUMN `revokedAt` `revoked_at` DATETIME(3) NULL;
ALTER TABLE `session` CHANGE COLUMN `expiresAt` `expires_at` DATETIME(3) NOT NULL;
ALTER TABLE `session` CHANGE COLUMN `deletedAt` `deleted_at` DATETIME(3) NULL;

-- Index renames
ALTER TABLE `permissions` DROP INDEX `permissions_permissionName_key`;
ALTER TABLE `permissions` ADD UNIQUE INDEX `permissions_name_key` (`name`);

ALTER TABLE `roles` DROP INDEX `roles_roleName_key`;
ALTER TABLE `roles` ADD UNIQUE INDEX `roles_name_key` (`name`);