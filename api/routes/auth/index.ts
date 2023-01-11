import express, { Request, Response, NextFunction } from 'express'
import auth from './resources/auth'
import passport from '../../utils/passport'

import createUser from './resources/createUser'
import { findUserAvailable, findEmailAvailable } from './resources/findUser'

const authRouter = express.Router()

authRouter.post('/createuser', createUser)
authRouter.get('/finduser/:username', findUserAvailable)
authRouter.get('/findemail/:email', findEmailAvailable)
authRouter.post('/login', auth)
authRouter.get('/google', passport.authenticate('google', { scope: ['email'] }))

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

authRouter.use(ensureAuthenticated)
authRouter.get('/auth', auth)

export default authRouter
