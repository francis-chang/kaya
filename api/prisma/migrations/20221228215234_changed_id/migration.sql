/*
  Warnings:

  - The primary key for the `Draft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Draft` table. All the data in the column will be lost.
  - The primary key for the `NBAPlayerOnDraft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NBAPlayerOnDraft` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NBAPlayerOnDraft" DROP CONSTRAINT "NBAPlayerOnDraft_draft_id_fkey";

-- AlterTable
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_pkey",
DROP COLUMN "id",
ADD COLUMN     "draft_id" SERIAL NOT NULL,
ADD CONSTRAINT "Draft_pkey" PRIMARY KEY ("draft_id");

-- AlterTable
ALTER TABLE "NBAPlayerOnDraft" DROP CONSTRAINT "NBAPlayerOnDraft_pkey",
DROP COLUMN "id",
ADD COLUMN     "nbaplayerondraft_id" SERIAL NOT NULL,
ADD CONSTRAINT "NBAPlayerOnDraft_pkey" PRIMARY KEY ("nbaplayerondraft_id");

-- AddForeignKey
ALTER TABLE "NBAPlayerOnDraft" ADD CONSTRAINT "NBAPlayerOnDraft_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "Draft"("draft_id") ON DELETE RESTRICT ON UPDATE CASCADE;
