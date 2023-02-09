import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'
import { z } from 'zod'
import names from './names'

const RequestBody = z.object({
    numGames: z.number(),
    draftFormat: z.string(),
    numberOfTeamsToSimul: z.number(),
    cats: z.array(z.string()),
    gameType: z.string(),
})

// data should not be any
const createGame = async (data: any, userId: number) => {
    return await client.game.create({
        data: {
            commissioner_id: userId,
            ...data,
            players: {
                create: {
                    user_id: userId,
                },
            },
        },
    })
}

export const createName = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        name: names
            .sort(() => Math.random() - 0.5)
            .slice(5, 7)
            .join(' '),
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.passport?.user
    if (!userId) {
        return res.status(401).json({ msg: 'CANNOT CREATE GAME - NO USER' })
    }
    try {
        RequestBody.parse(req.body)
    } catch (err) {
        return res.status(400).json(err)
    }

    const response = await wrapPrismaQuery(() => createGame(req.body, userId), res)
    return res.status(201).json(response)
}
