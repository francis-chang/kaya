/*
  Warnings:

  - Added the required column `pick_position` to the `Draft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "pick_numbers" INTEGER[],
ADD COLUMN     "pick_position" INTEGER NOT NULL;
