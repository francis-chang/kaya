import express, { Request, Response, NextFunction } from 'express'
import passport from '../../utils/passport'
import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'
import session from '../../utils/session'
import createGame from './resources/createGame'
import findAllGames from './resources/findAllGames'
import findGame from './resources/findGame'

const gameRouter = express.Router()

gameRouter.use(session)
gameRouter.use(passport.initialize())
gameRouter.use(passport.session())

const findUser = async (userId: number) => {
    return await client.user.findUnique({
        where: { user_id: userId },
    })
}

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const user = req.session.passport?.user
    if (req.isAuthenticated() && user) {
        const response = await wrapPrismaQuery(() => findUser(user), res)
        if (!response) {
            res.status(401).json({ msg: 'UNAUTHENTICATED' })
        } else {
            if (!response.verified) {
                res.status(401).json({ msg: 'Please go to Settings to verify your account.' })
            }
            res.locals.user = response
            return next()
        }
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

gameRouter.use(ensureAuthenticated)
gameRouter.post('/create', createGame)
gameRouter.get('/find/:id', findGame)
gameRouter.get('/getallgames', findAllGames)

export default gameRouter
