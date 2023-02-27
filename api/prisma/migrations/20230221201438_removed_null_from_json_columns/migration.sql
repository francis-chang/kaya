/*
  Warnings:

  - Made the column `all_picks` on table `Draft` required. This step will fail if there are existing NULL values in that column.
  - Made the column `picks` on table `Draft` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Draft" ALTER COLUMN "all_picks" SET NOT NULL,
ALTER COLUMN "all_picks" SET DEFAULT '[]',
ALTER COLUMN "picks" SET NOT NULL,
ALTER COLUMN "picks" SET DEFAULT '[]';
