import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import authRouter from './auth'
import gameRouter from './game'

const defaultRouter = express.Router()

defaultRouter.use('/auth', authRouter)
defaultRouter.use('/game', gameRouter)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const environment = process.env.NODE_ENV

    environment === 'development'
        ? res.status(500).json({ error: 'hiiii' })
        : res.status(500).json({ error: 'Server Error, Please try again later.' })
}

defaultRouter.use(errorHandler)

const fallBack = (req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
        res.status(404).json({ msg: 'An Error Occured' })
    }
}
defaultRouter.use(fallBack)

export default defaultRouter
