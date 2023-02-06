import express, { Request, Response, NextFunction } from 'express'
import login from './resources/login'
import auth from './resources/auth'
import passport from '../../utils/passport'

import createUser from './resources/createUser'
import { findUserAvailable, findEmailAvailable } from './resources/findUser'
import session from '../../utils/session'
import verify from './resources/verify'
import gAuth from './resources/gAuth'
import changeUsername from './resources/changeUsername'
import logout from './resources/logout'

import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'
import { setProfileIconColor, setProfileIconRequest } from './resources/setProfileIcons'

const findUser = async (userId: number) => {
    return await client.user.findUnique({
        where: { user_id: userId },
    })
}

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

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const user = req.session.passport?.user
    if (req.isAuthenticated() && user) {
        const response = await wrapPrismaQuery(() => findUser(user), res)
        if (!response) {
            return res.status(401).json({ msg: 'UNAUTHENTICATED' })
        } else {
            // if (!response.verified) {
            //     res.status(401).json({ msg: 'Please go to Settings to verify your account.' })
            // }
            res.locals.user = response
            return next()
        }
    }
    return res.status(401).json({ msg: 'UNAUTHENTICATED' })
}
authRouter.get('/logout', logout)
authRouter.use(ensureAuthenticated)
authRouter.get('/auth', auth)
authRouter.post('/changeusername', changeUsername)
authRouter.post('/verify', verify)
authRouter.post('/changeprofileicon', setProfileIconRequest)
authRouter.post('/changeprofilecolor', setProfileIconColor)

export default authRouter
