import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

// const v = new Validator()

// const schema: ValidationSchema = {
//     username: { type: 'string', optional: false },
//     password: { type: 'string', optional: false },
//     email: { type: 'string', optional: false },
// }
// const check = v.compile(schema)

const createGame = async (userId: number) => {
    return await client.game.create({ data: { commissioner_id: userId } })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId
    if (!userId) {
        res.status(401).json({ msg: 'CANNOT CREATE GAME - NO USER' })
    } else {
        const response = await wrapPrismaQuery(() => createGame(userId), res)
        res.status(201).json(response)
    }
}
