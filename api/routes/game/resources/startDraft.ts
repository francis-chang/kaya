import { NextFunction, Request, Response } from 'express'

import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

function generatePicks(pickerPosition: number, picksPerRound: number) {
    const numRounds = 12
    const picks = []

    for (let round = 0; round < numRounds; round++) {
        const offset = round % 2 === 0 ? pickerPosition - 1 : picksPerRound - pickerPosition
        const pickNumber = round * picksPerRound + offset + 1
        picks.push(pickNumber)
    }

    return picks
}

const createDraft = async (userforgame_id: number, pick_position: number, pick_numbers: number[]) => {
    return await client.draft.create({
        data: { userforgame_id, pick_position, pick_numbers },
    })
}

const findGame = async (game_id_string: string) => {
    const game_id = parseInt(game_id_string)
    if (Number.isNaN(game_id)) {
        throw new Error('game_id is invalid')
    }
    return await client.game.findUnique({
        where: { game_id },
        include: { players: true },
    })
}

// this needs validation in regards to checking if the user has drafted arleady for the draft interval currently being played

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.passport?.user
    const { game_id } = req.body

    if (!userId || !game_id) {
        return res.status(401).json({ msg: 'Certain Data is missing from the request' })
    } else {
        const game = await wrapPrismaQuery(() => findGame(game_id), res)
        if (!game) {
            return res.status(500).json({ msg: 'No Game was associated with game_id' })
        } else {
            const playerFound = game.players.find((g) => g.user_id === userId)
            if (!playerFound) {
                return res.status(400).json({ msg: 'Cannot start Draft because player has not joined game' })
            } else {
                const pick_position = Math.floor(Math.random() * 12 + 1)
                const pick_numbers = generatePicks(pick_position, game.numberOfTeamsToSimul)
                const response = await wrapPrismaQuery(
                    () => createDraft(playerFound.userforgame_id, pick_position, pick_numbers),
                    res
                )
                if (response) {
                    // const updateResponse =  await wrapPrismaQuery(() => updateGameWithDraft(game.game_id), res)
                    return res.status(201).json(response)
                }
            }
        }
    }
    next()
}
