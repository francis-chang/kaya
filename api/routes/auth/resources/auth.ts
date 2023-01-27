import { Request, Response, NextFunction } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findUser = async (user_id: number) => {
    return await client.user.findUnique({
        where: { user_id },
        select: {
            user_id: true,
            username: true,
        },
    })
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.passport?.user) {
        const response = await wrapPrismaQuery(() => findUser(req.session.passport!.user), res)
        if (response) {
            return res.status(200).json(response)
        }
    } else if (!req.session.userId) {
        return next()
    } else {
        const response = await wrapPrismaQuery(() => findUser(req.session.userId!), res)
        if (!response) {
            return next()
        }
        return res.status(200).json(response)
    }
}

export default auth
