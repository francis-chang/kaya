import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findAllGames = async (userId: number) => {
    const response = await client.user.findUnique({
        where: { user_id: userId },
        select: {
            games: { select: { game: true } },
        },
    })
    if (response) {
        return response.games.map((game) => game.game)
    }
    return null
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.passport?.user
    if (!userId) {
        return res.status(401).json({ msg: 'No User was associated, Please Login Again.' })
    } else {
        const response = await wrapPrismaQuery(() => findAllGames(userId), res)
        if (!response) {
            return res.status(500).json({ msg: 'Games for User cannot be fetched. Please Try Again.' })
        } else {
            return res.status(201).json(response)
        }
    }
}
