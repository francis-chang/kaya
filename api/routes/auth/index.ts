import express, { Request, Response, NextFunction } from 'express'
import Auth from './resources/auth'

import createUser from './resources/createUser'

const authRouter = express.Router()

authRouter.post('/createuser', createUser)

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

authRouter.use(ensureAuthenticated)
authRouter.get('/auth', Auth)

export default authRouter
