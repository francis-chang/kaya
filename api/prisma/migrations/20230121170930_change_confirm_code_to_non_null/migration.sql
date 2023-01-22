/*
  Warnings:

  - Made the column `confirmation_code` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "confirmation_code" SET NOT NULL,
ALTER COLUMN "confirmation_code" SET DEFAULT '';
