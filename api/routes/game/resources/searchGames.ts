import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findAllGames = async () => {
    const response = await client.game.findMany({
        select: {
            draftFormat: true,
            commissioner_id: true,
            cats: true,
            draftIntervalInformation: true,
            gameType: true,
            game_id: true,
            name: true,
            numGames: true,
            numberOfTeamsToSimul: true,
            status: true,
        },
        orderBy: {
            game_id: 'desc',
        },
    })

    return response
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.passport?.user
    if (!userId) {
        return res.status(401).json({ msg: 'No User was associated, Please Login Again.' })
    } else {
        const response = await wrapPrismaQuery(() => findAllGames(), res)
        if (!response) {
            return res.status(500).json({ msg: 'Games for User cannot be fetched. Please Try Again.' })
        } else {
            return res.status(201).json(response)
        }
    }
}
