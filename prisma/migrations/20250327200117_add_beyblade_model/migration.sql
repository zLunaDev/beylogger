-- CreateTable
CREATE TABLE `Beyblade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `peso` DOUBLE NOT NULL,
    `attack` INTEGER NOT NULL,
    `stamina` INTEGER NOT NULL,
    `defesa` INTEGER NOT NULL,
    `equilibrio` INTEGER NOT NULL,
    `bladeId` INTEGER NOT NULL,
    `ratchetId` INTEGER NOT NULL,
    `bitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_bladeId_fkey` FOREIGN KEY (`bladeId`) REFERENCES `Part`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_ratchetId_fkey` FOREIGN KEY (`ratchetId`) REFERENCES `Part`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_bitId_fkey` FOREIGN KEY (`bitId`) REFERENCES `Part`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
