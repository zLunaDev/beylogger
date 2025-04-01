/*
  Warnings:

  - You are about to drop the `defaultcombo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `beyblade` DROP FOREIGN KEY `Beyblade_bitId_fkey`;

-- DropForeignKey
ALTER TABLE `beyblade` DROP FOREIGN KEY `Beyblade_bladeId_fkey`;

-- DropForeignKey
ALTER TABLE `beyblade` DROP FOREIGN KEY `Beyblade_ratchetId_fkey`;

-- DropForeignKey
ALTER TABLE `combo` DROP FOREIGN KEY `Combo_bitId_fkey`;

-- DropForeignKey
ALTER TABLE `combo` DROP FOREIGN KEY `Combo_bladeId_fkey`;

-- DropForeignKey
ALTER TABLE `combo` DROP FOREIGN KEY `Combo_ratchetId_fkey`;

-- DropForeignKey
ALTER TABLE `defaultcombo` DROP FOREIGN KEY `DefaultCombo_bitId_fkey`;

-- DropForeignKey
ALTER TABLE `defaultcombo` DROP FOREIGN KEY `DefaultCombo_bladeId_fkey`;

-- DropForeignKey
ALTER TABLE `defaultcombo` DROP FOREIGN KEY `DefaultCombo_ratchetId_fkey`;

-- DropForeignKey
ALTER TABLE `partimage` DROP FOREIGN KEY `PartImage_partId_fkey`;

-- DropIndex
DROP INDEX `Beyblade_bitId_fkey` ON `beyblade`;

-- DropIndex
DROP INDEX `Beyblade_bladeId_fkey` ON `beyblade`;

-- DropIndex
DROP INDEX `Beyblade_ratchetId_fkey` ON `beyblade`;

-- DropIndex
DROP INDEX `Combo_bitId_fkey` ON `combo`;

-- DropIndex
DROP INDEX `Combo_bladeId_fkey` ON `combo`;

-- DropIndex
DROP INDEX `Combo_ratchetId_fkey` ON `combo`;

-- DropTable
DROP TABLE `defaultcombo`;

-- DropTable
DROP TABLE `part`;

-- DropTable
DROP TABLE `partimage`;

-- CreateTable
CREATE TABLE `Blade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ratchet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BladeImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bladeId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatchetImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ratchetId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BitImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bitId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BladeImage` ADD CONSTRAINT `BladeImage_bladeId_fkey` FOREIGN KEY (`bladeId`) REFERENCES `Blade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatchetImage` ADD CONSTRAINT `RatchetImage_ratchetId_fkey` FOREIGN KEY (`ratchetId`) REFERENCES `Ratchet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BitImage` ADD CONSTRAINT `BitImage_bitId_fkey` FOREIGN KEY (`bitId`) REFERENCES `Bit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_bladeId_fkey` FOREIGN KEY (`bladeId`) REFERENCES `Blade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_ratchetId_fkey` FOREIGN KEY (`ratchetId`) REFERENCES `Ratchet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beyblade` ADD CONSTRAINT `Beyblade_bitId_fkey` FOREIGN KEY (`bitId`) REFERENCES `Bit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combo` ADD CONSTRAINT `Combo_bladeId_fkey` FOREIGN KEY (`bladeId`) REFERENCES `Blade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combo` ADD CONSTRAINT `Combo_ratchetId_fkey` FOREIGN KEY (`ratchetId`) REFERENCES `Ratchet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combo` ADD CONSTRAINT `Combo_bitId_fkey` FOREIGN KEY (`bitId`) REFERENCES `Bit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
