import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

import pusher from '../../../utils/pusher'

const joinGame = async (game_id: number, user_id: number) => {
    return await client.userForGame.create({
        data: {
            user_id,
            game_id,
        },
    })
}

const leaveGame = async (userforgame_id: number) => {
    return await client.userForGame.delete({
        where: { userforgame_id },
    })
}

const getGame = async (game_id: number) => {
    return await client.game.findUnique({
        where: {
            game_id,
        },
        include: {
            players: {
                include: {
                    user: {
                        select: {
                            user_id: true,
                            username: true,
                            profile_icon: true,
                            profile_icon_color: true,
                        },
                    },
                },
            },
        },
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.passport?.user
    const { game_id } = req.body
    const game = await wrapPrismaQuery(() => getGame(game_id), res)

    if (game && game.players.find((g) => g.user_id === userId)) {
        return res.status(401).json({ msg: 'User is already joined' })
    }

    if (game_id && userId) {
        const response = await joinGame(game_id, userId)
        if (response) {
            const game = await wrapPrismaQuery(() => getGame(game_id), res)
            if (game) {
                await pusher.trigger(`nbafantasygame_${game.game_id}`, 'players_adjust', game.players)
            }
            return res.status(200).json(response)
        }
    }
    return res.status(400).json({ msg: 'Something went wrong with joining Game' })
}

export const leaveGameEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.passport?.user
    const { userforgame_id } = req.body

    if (userId && userforgame_id) {
        const response = await wrapPrismaQuery(() => leaveGame(userforgame_id), res)
        if (response) {
            const game = await wrapPrismaQuery(() => getGame(response.game_id), res)
            if (game) {
                await pusher.trigger(`nbafantasygame_${game.game_id}`, 'players_adjust', game.players)
            }
            return res.status(201).json({ msg: 'Leaving Successful' })
        }
    }
    return res.status(400).json({ msg: 'Something went wrong with Leaving' })
}
