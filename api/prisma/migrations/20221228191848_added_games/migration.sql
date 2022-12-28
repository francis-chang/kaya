-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "commissioner_id" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnGames" (
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "UserOnGames_pkey" PRIMARY KEY ("player_id","game_id")
);

-- CreateTable
CREATE TABLE "UserInformationForGame" (
    "id" SERIAL NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInformationForGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NBAPlayerOnDraft" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "game_ids" INTEGER[],
    "draft_id" INTEGER NOT NULL,

    CONSTRAINT "NBAPlayerOnDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draft" (
    "id" SERIAL NOT NULL,
    "user_information_Id" INTEGER NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Draft_user_information_Id_key" ON "Draft"("user_information_Id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_commissioner_id_fkey" FOREIGN KEY ("commissioner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGames" ADD CONSTRAINT "UserOnGames_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGames" ADD CONSTRAINT "UserOnGames_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NBAPlayerOnDraft" ADD CONSTRAINT "NBAPlayerOnDraft_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "Draft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_user_information_Id_fkey" FOREIGN KEY ("user_information_Id") REFERENCES "UserInformationForGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
