import RedisConnect from 'connect-redis'
import session from 'express-session'
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_SESSION_URL ? process.env.REDIS_SESSION_URL : ''
const secret = process.env.SECRET ? process.env.SECRET : ''

// if not redisUrl or secret log warning / error / fatal

const RedisStore = RedisConnect(session)
const redisClient = new Redis(redisUrl)

declare module 'express-session' {
    export interface SessionData {
        userId: number
    }
}

const sessionOptions = {
    secret,
    store: new RedisStore({ client: redisClient }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        //30 minutes
        maxAge: 1800000,
        secure: false,
        sameSite: false,
        httpOnly: true,
    },
}

export default session(sessionOptions)
