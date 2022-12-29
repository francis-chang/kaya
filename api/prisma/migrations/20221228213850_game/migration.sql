/*
  Warnings:

  - You are about to drop the `UserInformationForGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnGames` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_user_information_Id_fkey";

-- DropForeignKey
ALTER TABLE "UserOnGames" DROP CONSTRAINT "UserOnGames_game_id_fkey";

-- DropForeignKey
ALTER TABLE "UserOnGames" DROP CONSTRAINT "UserOnGames_player_id_fkey";

-- DropTable
DROP TABLE "UserInformationForGame";

-- DropTable
DROP TABLE "UserOnGames";

-- CreateTable
CREATE TABLE "UserForGame" (
    "id" SERIAL NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "UserForGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserForGame" ADD CONSTRAINT "UserForGame_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForGame" ADD CONSTRAINT "UserForGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_user_information_Id_fkey" FOREIGN KEY ("user_information_Id") REFERENCES "UserForGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
