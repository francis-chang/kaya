import express, { Request, Response, NextFunction } from 'express'
import createGame from './resources/createGame'

const gameRouter = express.Router()

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

gameRouter.use(ensureAuthenticated)
gameRouter.post('/create', createGame)

export default gameRouter
