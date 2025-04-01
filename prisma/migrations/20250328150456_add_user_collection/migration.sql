-- AlterTable
ALTER TABLE `user` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `username` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `UserCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `beybladeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserCollection_userId_beybladeId_key`(`userId`, `beybladeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserCollection` ADD CONSTRAINT `UserCollection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCollection` ADD CONSTRAINT `UserCollection_beybladeId_fkey` FOREIGN KEY (`beybladeId`) REFERENCES `Beyblade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
