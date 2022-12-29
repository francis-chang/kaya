import passport from 'passport'
import { client } from '../prismaClient'
import googleStrat from './googleStrat'
import userpassStrat from './userpassStrat'

declare global {
    namespace Express {
        interface User {
            user_id: number
            username: string
        }
    }
}

declare module 'express-session' {
    export interface SessionData {
        passport: { user: number }
    }
}

userpassStrat(passport)
googleStrat(passport)

passport.serializeUser(function (user, done) {
    done(null, user.user_id)
})

passport.deserializeUser(async function (user_id: number, done) {
    try {
        const user = await client.user.findUnique({ where: { user_id }, select: { user_id: true, username: true } })
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})

export default passport
