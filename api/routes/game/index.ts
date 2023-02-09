import express, { Request, Response, NextFunction } from 'express'
import passport from '../../utils/passport'
import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'
import session from '../../utils/session'
import createGame, { createName } from './resources/createGame'
import findAllGames from './resources/findAllGames'
import findGame from './resources/findGame'
import joinGame, { leaveGameEndpoint, kickPlayerFromGame } from './resources/joinGame'

const gameRouter = express.Router()
gameRouter.get('/createname', createName)

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
gameRouter.post('/joingame', joinGame)
gameRouter.post('/leavegame', leaveGameEndpoint)
gameRouter.post('/kickplayer', kickPlayerFromGame)

export default gameRouter
