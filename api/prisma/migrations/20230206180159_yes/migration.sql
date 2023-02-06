/*
  Warnings:

  - Made the column `profile_icon` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_icon" SET NOT NULL,
ALTER COLUMN "profile_icon" SET DEFAULT 'user';
