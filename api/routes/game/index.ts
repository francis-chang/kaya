import express, { Request, Response, NextFunction } from 'express'
import passport from '../../utils/passport'
import session from '../../utils/session'
import createGame from './resources/createGame'
import findAllGames from './resources/findAllGames'
import findGame from './resources/findGame'

const gameRouter = express.Router()

gameRouter.use(session)
gameRouter.use(passport.initialize())
gameRouter.use(passport.session())

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

gameRouter.use(ensureAuthenticated)
gameRouter.post('/create', createGame)
gameRouter.get('/find/:id', findGame)
gameRouter.get('/getallgames', findAllGames)

export default gameRouter
