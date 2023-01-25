-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_discord_oauth_acc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_google_oauth_acc" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "lower_username" DROP NOT NULL;
