import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findGame = async (game_id: number) => {
    return await client.game.findUnique({
        where: { game_id },
        include: {
            players: {
                include: {
                    user: { select: { username: true, user_id: true, profile_icon: true, profile_icon_color: true } },

                    draft: true,
                },
            },
        },
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const gameId = parseInt(req.params.id)
    if (!gameId) {
        res.status(401).json({ msg: 'CANNOT CREATE GAME - NO ID' })
    } else {
        const response = await wrapPrismaQuery(() => findGame(gameId), res)
        if (!response) {
            res.status(404).json({ msg: `GAME ID OF ${gameId} NOT FOUND` })
        } else {
            res.status(201).json(response)
        }
    }
}
