-- CreateTable
CREATE TABLE `ComboLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comboId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ComboLike_comboId_idx`(`comboId`),
    INDEX `ComboLike_userId_idx`(`userId`),
    UNIQUE INDEX `ComboLike_comboId_userId_key`(`comboId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
