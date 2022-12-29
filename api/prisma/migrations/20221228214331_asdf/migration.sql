/*
  Warnings:

  - You are about to drop the column `user_information_Id` on the `Draft` table. All the data in the column will be lost.
  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserForGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserForGame` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userforgame_id]` on the table `Draft` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userforgame_id` to the `Draft` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_user_information_Id_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_commissioner_id_fkey";

-- DropForeignKey
ALTER TABLE "UserForGame" DROP CONSTRAINT "UserForGame_game_id_fkey";

-- DropForeignKey
ALTER TABLE "UserForGame" DROP CONSTRAINT "UserForGame_user_id_fkey";

-- DropIndex
DROP INDEX "Draft_user_information_Id_key";

-- AlterTable
ALTER TABLE "Draft" DROP COLUMN "user_information_Id",
ADD COLUMN     "userforgame_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "id",
ADD COLUMN     "game_id" SERIAL NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "UserForGame" DROP CONSTRAINT "UserForGame_pkey",
DROP COLUMN "id",
ADD COLUMN     "userforgame_id" SERIAL NOT NULL,
ADD CONSTRAINT "UserForGame_pkey" PRIMARY KEY ("userforgame_id");

-- CreateIndex
CREATE UNIQUE INDEX "Draft_userforgame_id_key" ON "Draft"("userforgame_id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_commissioner_id_fkey" FOREIGN KEY ("commissioner_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForGame" ADD CONSTRAINT "UserForGame_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForGame" ADD CONSTRAINT "UserForGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userforgame_id_fkey" FOREIGN KEY ("userforgame_id") REFERENCES "UserForGame"("userforgame_id") ON DELETE RESTRICT ON UPDATE CASCADE;
