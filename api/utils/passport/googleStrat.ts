import { PassportStatic } from 'passport'
import Strategy from 'passport-google-oauth'
import { client } from '../prismaClient'
import * as argon2 from 'argon2'

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ? process.env.GOOGLE_OAUTH_CLIENT_ID : ''
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ? process.env.GOOGLE_OAUTH_CLIENT_SECRET : ''

export default (passport: PassportStatic) => {
    passport.use(
        new Strategy.OAuth2Strategy(
            {
                clientID: GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
                callbackURL: 'http://localhost:3333/oauth',
            },
            (accessToken, refreshToken, profile, cb) => {
                console.log({ accessToken, refreshToken, profile, cb })
            }
        )
    )
}
