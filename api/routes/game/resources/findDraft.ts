import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findDraft = async (draft_id: number) => {
    return await client.draft.findUnique({
        where: { draft_id },
        include: {
            userforgame: {
                include: {
                    game: {
                        select: {
                            numberOfTeamsToSimul: true,
                            draft_interval_time: true,
                            game_id: true,
                            status: true,
                            gameType: true,
                        },
                    },
                },
            },
        },
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.passport?.user
    const { draft_id } = req.body
    if (!draft_id || !userId) {
        res.status(401).json({ msg: 'Request does not have specified request body or user' })
    } else {
        const response = await wrapPrismaQuery(() => findDraft(draft_id), res)
        if (response) {
            if (response.userforgame.user_id !== userId) {
                res.status(401).json({ msg: 'UNAUTHORIZED' })
            } else {
                res.status(200).json(response)
            }
        }
    }
    next()
}
