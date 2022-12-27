import RedisConnect from 'connect-redis'
import session from 'express-session'
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_SESSION_URL ? process.env.REDIS_SESSION_URL : ''
const secret = process.env.SECRET ? process.env.SECRET : ''

const RedisStore = RedisConnect(session)
const redisClient = new Redis(redisUrl)

const sessionOptions = {
    secret,
    store: new RedisStore({ client: redisClient }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        //30 minutes
        maxAge: 1800000,
        secure: false,
    },
}

export default session(sessionOptions)
