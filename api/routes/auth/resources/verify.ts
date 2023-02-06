import { Request, Response, NextFunction } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const findUserConfirmationCode = async (user_id: number) => {
    return await client.user.findUnique({
        where: { user_id },
        select: {
            confirmation_code: true,
        },
    })
}

const verifyUser = async (user_id: number) => {
    return await client.user.update({
        where: { user_id },
        data: {
            verified: true,
        },
        select: {
            user_id: true,
            username: true,
            verified: true,
        },
    })
}

const verify = async (req: Request, res: Response, next: NextFunction) => {
    const { confirmation_code } = req.body
    if (!confirmation_code) {
        res.status(400).json({ msg: 'Please Input Your Confirmation Code.' })
        return
    } else if (!req.session?.passport?.user) {
        console.log('what')
        res.clearCookie('connect.sid').status(401)
        return
    } else {
        const response = await wrapPrismaQuery(() => findUserConfirmationCode(req.session?.passport?.user!), res)

        if (!response) {
            res.clearCookie('connect.sid').status(401)
            return
        }

        if (response.confirmation_code === confirmation_code) {
            const verifiedResponse = await wrapPrismaQuery(() => verifyUser(req.session?.passport?.user!), res)

            if (!verifiedResponse) {
                res.clearCookie('connect.sid').status(401)
                return
            } else {
                res.status(200).json(verifiedResponse)
            }
        } else {
            res.status(401).json({ msg: 'Confirmation Code is Incorrect. Please Try Again.' })
        }
    }
}

export default verify
