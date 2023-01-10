import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findUser = async (lower_username: string) => {
    return await client.user.findUnique({
        where: { lower_username },
    })
}

// this may need to be case sensitive as well
const findEmail = async (email: string) => {
    return await client.user.findUnique({
        where: { email },
    })
}

export const findUserAvailable = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params
    if (!username) {
        res.status(401).json({ msg: 'CANNOT FIND USERNAME - NO USERNAME IN PARAMS' })
    } else {
        const lower_username = username.toLowerCase()
        const response = await wrapPrismaQuery(() => findUser(lower_username), res)
        if (!response) {
            res.status(200).json({ msg: 'USERNAME_AVAILABLE' })
        } else {
            res.status(401).json({ msg: 'USERNAME_UNAVAILABLE' })
        }
    }
}

export const findEmailAvailable = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params
    if (!email) {
        res.status(401).json({ msg: 'CANNOT FIND USERNAME - NO EMAIL IN PARAMS' })
    } else {
        const response = await wrapPrismaQuery(() => findEmail(email), res)
        if (!response) {
            res.status(200).json({ msg: 'EMAIL_AVAILABLE' })
        } else {
            res.status(401).json({ msg: 'EMAIL_UNAVAILABLE' })
        }
    }
}
