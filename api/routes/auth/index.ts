import express, { Request, Response, NextFunction } from 'express'
import auth from './resources/auth'
import passport from '../../utils/passport'

import createUser from './resources/createUser'
import { findUserAvailable, findEmailAvailable } from './resources/findUser'
import axios from 'axios'

const authRouter = express.Router()

authRouter.post('/createuser', createUser)
authRouter.get('/finduser/:username', findUserAvailable)
authRouter.get('/findemail/:email', findEmailAvailable)
authRouter.post('/login', auth)
authRouter.get('/google', passport.authenticate('google', { scope: ['email'] }))

authRouter.get('/sendtestemail', async (req, res) => {
    try {
        await axios.post(
            'https://api.postmarkapp.com/email',
            {
                From: 'FTY Fantasy Sports <noreply@fty.gg>',
                To: 'fcs.kb24@gmail.com',
                Subject: 'Postmark Test',
                TextBody: 'Hello deark postmark user.',
                MessageStream: 'outbound',
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN,
                },
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({ hello: 'hello' })
        return
    }
    res.status(200).json({ hello: 'hello' })
    return
})

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return next()
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

authRouter.use(ensureAuthenticated)
authRouter.get('/auth', auth)

export default authRouter
