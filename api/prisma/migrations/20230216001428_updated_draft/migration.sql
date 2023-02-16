-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "all_picks" JSONB,
ADD COLUMN     "current_pick" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "draft_ended" TIMESTAMP(3),
ADD COLUMN     "draft_started" TIMESTAMP(3),
ADD COLUMN     "picks" JSONB,
ADD COLUMN     "time_till_next_pick" TIMESTAMP(3);
