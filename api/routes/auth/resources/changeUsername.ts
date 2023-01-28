import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findUser = async (userId: number) => {
    return await client.user.findUnique({
        where: { user_id: userId },
    })
}

const changeUsername = async (username: string, userId: number) => {
    return await client.user.update({
        where: { user_id: userId },
        data: { username, lower_username: username.toLowerCase() },
        select: {
            user_id: true,
            username: true,
            verified: true,
        },
    })
}

// THIS NEEDS USERNAME VALIDATION

export default async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.passport?.user
    if (!userId) {
        return res.status(401).json({ msg: 'No User was associated, Please Login Again.' })
    } else {
        const user = await wrapPrismaQuery(() => findUser(userId), res)
        if (!user) {
            return res.status(401).json({ msg: 'No User was associated, Please Login Again.' })
        } else {
            const { username } = req.body
            if (!username) {
                return res.status(400).json({ msg: 'No Username was Provided' })
            } else {
                const response = await wrapPrismaQuery(() => changeUsername(username, userId), res)
                if (!response) {
                    return res.status(500).json({ msg: 'Games for User cannot be fetched. Please Try Again.' })
                } else {
                    let settingsWarnings = 0
                    if (!response.verified) {
                        settingsWarnings++
                    }
                    if (response.username === null) {
                        settingsWarnings++
                    }
                    return res.status(201).json({ ...response, settingsWarnings })
                }
            }
        }
    }
}
