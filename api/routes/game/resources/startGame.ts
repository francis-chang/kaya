import { addDays, addMinutes } from 'date-fns'
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

const startGame = async (
    game_id: number,
    scheduleResponse: any,
    first_game: any,
    last_game: any,
    game_start: string
) => {
    const now = new Date()

    return await client.game.update({
        where: {
            game_id,
        },
        data: {
            currentSDSchedule: scheduleResponse,
            status: 'STARTED',
            draftIntervalInformation: {
                date_started: now.toUTCString(),
                first_game,
                last_game,
                game_start,
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
                let first_game = {} as any
                let last_game = {} as any

                scheduleResponse.forEach((team, teamIndex) => {
                    team.games.forEach((g, index) => {
                        if (index === 0 && teamIndex === 0) {
                            last_game = g
                            first_game = g
                        } else {
                            if (g.DateTime > last_game.DateTime) {
                                last_game = g
                            }
                            if (g.DateTime < first_game.DateTime) {
                                first_game = g
                            }
                        }
                    })
                })

                const game_start = addMinutes(new Date(first_game.DateTime), -30).toUTCString()

                const response = await wrapPrismaQuery(
                    () => startGame(game.game_id, scheduleResponse, first_game, last_game, game_start),
                    res
                )
                return res.status(200).json(response)
            }
        }
    }
    next()
}
