import { Request, Response, NextFunction } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findUser = async (user_id: number) => {
    return await client.user.findUnique({
        where: { user_id },
        select: {
            user_id: true,
            username: true,
            profile_icon: true,
            verified: true,
            profile_icon_color: true,
        },
    })
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.passport?.user) {
        const response = await wrapPrismaQuery(() => findUser(req.session.passport!.user), res)

        if (response) {
            let settingsWarnings = 0
            if (!response.verified) {
                settingsWarnings++
            }
            if (response.username === null) {
                settingsWarnings++
            }
            return res.status(200).json({ ...response, settingsWarnings })
        }
    } else if (!req.session.userId) {
        return res.status(400)
    } else {
        const response = await wrapPrismaQuery(() => findUser(req.session.userId!), res)
        if (!response) {
            return res.status(400)
        }
        let settingsWarnings = 0
        if (!response.verified) {
            settingsWarnings++
        }
        if (response.username === null) {
            settingsWarnings++
        }
        return res.status(200).json({ ...response, settingsWarnings })
    }
}

export default auth
