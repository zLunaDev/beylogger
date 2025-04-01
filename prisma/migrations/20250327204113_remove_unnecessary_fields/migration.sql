/*
  Warnings:

  - You are about to drop the column `descricao` on the `beyblade` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `beyblade` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `beyblade` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `beyblade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `beyblade` DROP COLUMN `descricao`,
    DROP COLUMN `nome`,
    DROP COLUMN `peso`,
    DROP COLUMN `tipo`;
