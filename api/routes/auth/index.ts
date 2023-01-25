import express, { Request, Response, NextFunction } from 'express'
import login from './resources/login'
import auth from './resources/auth'
import passport from '../../utils/passport'

import createUser from './resources/createUser'
import { findUserAvailable, findEmailAvailable } from './resources/findUser'
import session from '../../utils/session'
import verify from './resources/verify'
import gAuth from './resources/gAuth'

const authRouter = express.Router()

authRouter.get('/finduser/:username', findUserAvailable)
authRouter.get('/findemail/:email', findEmailAvailable)
authRouter.get('/google', passport.authenticate('google', { scope: ['email'] }))

authRouter.use(session)
authRouter.use(passport.initialize())
authRouter.use(passport.session())

authRouter.post('/createuser', createUser)
authRouter.get('/googlecallback', gAuth)
authRouter.post('/login', login)
// authRouter.post('/gauth', gAuth)

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

authRouter.use(ensureAuthenticated)
authRouter.get('/auth', auth)
authRouter.post('/verify', verify)

export default authRouter
