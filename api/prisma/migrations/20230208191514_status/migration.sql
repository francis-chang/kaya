-- CreateEnum
CREATE TYPE "Status" AS ENUM ('LOBBY', 'STARTED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'LOBBY';
