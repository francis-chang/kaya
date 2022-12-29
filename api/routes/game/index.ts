import express, { Request, Response, NextFunction } from 'express'
import createGame from './resources/createGame'
import findGame from './resources/findGame'

const gameRouter = express.Router()

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

gameRouter.use(ensureAuthenticated)
gameRouter.post('/create', createGame)
gameRouter.get('/find/:id', findGame)

export default gameRouter
