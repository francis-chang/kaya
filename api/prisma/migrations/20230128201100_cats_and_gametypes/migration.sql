-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('PTS', 'REB', 'AST', 'STL', 'BLK', 'TOS', 'FGP', 'FTP', 'TPP', 'FAN');

-- CreateEnum
CREATE TYPE "GameTypes" AS ENUM ('KOTH', 'SINGLE', 'SEASON');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cats" "Categories"[],
ADD COLUMN     "gameType" "GameTypes" NOT NULL DEFAULT 'SINGLE';
