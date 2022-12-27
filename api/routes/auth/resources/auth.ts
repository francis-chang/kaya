import { client } from '../../../utils/prismaClient'
import { NextFunction, Request, Response } from 'express'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'

const somePrismaQuery = async () => {}

const Auth = async (req: Request, res: Response, next: NextFunction) => {
    const response = await wrapPrismaQuery(() => somePrismaQuery(), res)
    if (response) {
        res.status(200).json({ msg: 'succes' })
    } else {
        res.status(404).json({ msg: 'failure' })
    }
}
export default Auth
