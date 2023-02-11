-- CreateEnum
CREATE TYPE "DraftStatusOptions" AS ENUM ('NOT_STARTED', 'STARTED', 'ENDED');

-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "status" "DraftStatusOptions" NOT NULL DEFAULT 'NOT_STARTED';
