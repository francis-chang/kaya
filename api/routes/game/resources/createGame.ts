import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'
import { z } from 'zod'

const RequestBody = z.object({
    numGames: z.number(),
    draftFormat: z.string(),
    numberOfTeamsToSimul: z.number(),
})

const createGame = async (data: z.infer<typeof RequestBody>, userId: number) => {
    return await client.game.create({
        data: {
            commissioner_id: userId,
            ...data,
            players: {
                create: {
                    user_id: userId,
                    draft: { create: {} },
                },
            },
        },
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.passport?.user
    console.log(userId)
    if (!userId) {
        return res.status(401).json({ msg: 'CANNOT CREATE GAME - NO USER' })
    }
    try {
        RequestBody.parse(req.body)
    } catch (err) {
        return res.status(400).json(err)
    }

    const response = await wrapPrismaQuery(() => createGame(req.body, userId), res)
    res.status(201).json(response)
}
