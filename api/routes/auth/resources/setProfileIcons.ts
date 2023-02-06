import { NextFunction, Request, Response } from 'express'
import { client } from '../../../utils/prismaClient'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const setProfileIcon = async (user_id: number, profile_icon: string) => {
    return await client.user.update({
        where: { user_id },
        data: { profile_icon },
        select: { profile_icon: true },
    })
}

const setColor = async (user_id: number, profile_icon_color: string) => {
    return await client.user.update({
        where: { user_id },
        data: { profile_icon_color },
        select: { profile_icon_color: true },
    })
}

export const setProfileIconRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { profile_icon } = req.body
    const user_id = req.session.passport?.user
    if (!profile_icon || !user_id) {
        res.status(401).json({ msg: 'CANNOT profile_icon in request body or user_id is not provided' })
    } else {
        const response = await wrapPrismaQuery(() => setProfileIcon(user_id, profile_icon), res)
        if (response) {
            return res.status(201).json({ profile_icon: response.profile_icon })
        }
        return res.status(500).json({ msg: 'Icon was not set, Please try again.' })
    }
}

export const setProfileIconColor = async (req: Request, res: Response, next: NextFunction) => {
    const { profile_icon_color } = req.body
    const user_id = req.session.passport?.user
    if (!profile_icon_color || !user_id) {
        res.status(401).json({ msg: 'CANNOT profile_icon in request body or user_id is not provided' })
    } else {
        const response = await wrapPrismaQuery(() => setColor(user_id, profile_icon_color), res)
        if (response) {
            return res.status(201).json({ profile_icon_color: response.profile_icon_color })
        }
        return res.status(500).json({ msg: 'Icon was not set, Please try again.' })
    }
}
