/*
  Warnings:

  - Added the required column `draftFormat` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numGames` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfTeamsToSimul` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "draftFormat" TEXT NOT NULL,
ADD COLUMN     "numGames" INTEGER NOT NULL,
ADD COLUMN     "numberOfTeamsToSimul" INTEGER NOT NULL;
