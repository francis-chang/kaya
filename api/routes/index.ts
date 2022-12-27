import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import authRouter from './auth'

const defaultRouter = express.Router()

defaultRouter.use('/auth', authRouter)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const environment = process.env.NODE_ENV

    environment === 'development'
        ? res.status(500).json({ error: err })
        : res.status(500).json({ error: 'Server Error, Please try again later.' })
}

defaultRouter.use(errorHandler)

const fallBack = (req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
        res.status(500).json({ msg: 'A fatal error occured' })
    }
}
defaultRouter.use(fallBack)

export default defaultRouter
