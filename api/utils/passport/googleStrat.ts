import { PassportStatic } from 'passport'
import Strategy from 'passport-google-oauth'
import { client } from '../prismaClient'
import * as argon2 from 'argon2'
import { wrapPrismaQueryNoResponse } from '../prismaTryCatch'

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ? process.env.GOOGLE_OAUTH_CLIENT_ID : ''
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ? process.env.GOOGLE_OAUTH_CLIENT_SECRET : ''

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : ''

const findEmail = async (email: string) => {
    return await client.user.findUnique({
        where: { email },
    })
}

const createUser = async (email: string) => {
    return await client.user.create({
        data: { email, is_google_oauth_acc: true, verified: true },
    })
}

export default (passport: PassportStatic) => {
    passport.use(
        new Strategy.OAuth2Strategy(
            {
                clientID: GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
                callbackURL:
                    NODE_ENV === 'development'
                        ? 'http://localhost:5555/auth/googlecallback'
                        : 'http://kaya.fty.gg/auth/googlecallback',
                passReqToCallback: true,
            },
            async (request, accessToken, refreshToken, profile, done) => {
                if (profile.emails && profile.emails.length > 0) {
                    const value = profile.emails[0].value
                    const response = await wrapPrismaQueryNoResponse(() => findEmail(value))
                    if (response) {
                        return done(null, response)
                    } else {
                        const createResponse = await wrapPrismaQueryNoResponse(() => createUser(value))
                        return done(null, createResponse)
                    }
                }
            }
        )
    )
}
