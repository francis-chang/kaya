/*
  Warnings:

  - You are about to drop the column `ProfileIcon` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ProfileIcon",
ADD COLUMN     "profile_icon" TEXT;
