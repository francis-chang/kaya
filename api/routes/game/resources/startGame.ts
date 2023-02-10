import { addDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { NextFunction, Request, Response } from 'express'
import { getScheduleSD } from '../../../utils/api/yasha'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findGame = async (game_id_string: string) => {
    const game_id = parseInt(game_id_string)
    if (Number.isNaN(game_id)) {
        throw new Error('game_id is invalid')
    }
    return await client.game.findUnique({
        where: { game_id },
    })
}

const startGame = async (game_id: number, scheduleResponse: any) => {
    const now = new Date()
    addDays
    return await client.game.update({
        where: {
            game_id,
        },
        data: {
            currentSDSchedule: scheduleResponse,
            status: 'STARTED',
            draftIntervalInformation: {
                date_started: now.toUTCString(),
                draft_interval_end: addDays(now, 1).toUTCString(),
            },
        },
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
    const userId = req.session.passport?.user
    const { game_id } = req.body

    if (!userId || !game_id) {
        return res.status(401).json({ msg: 'Certain Data is missing from the request' })
    } else {
        const game = await wrapPrismaQuery(() => findGame(game_id), res)
        if (!game) {
            return res.status(500).json({ msg: 'No Game was associated with game_id' })
        } else {
            if (game.commissioner_id !== userId) {
                res.status(401)
            }
            const scheduleResponse = await getScheduleSD(game.numGames, game.singleDraftDraftPeriod)

            if (scheduleResponse) {
                const response = await wrapPrismaQuery(() => startGame(game.game_id, scheduleResponse), res)
                return res.status(200).json(response)
            }
        }
    }
    next()
}
