import passport from 'passport'
import { client } from '../prismaClient'
import userpassStrat from './userpassStrat'

declare global {
    namespace Express {
        interface User {
            id: number
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

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(async function (id: number, done) {
    try {
        const user = await client.user.findUnique({ where: { id } })
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})

export default passport
