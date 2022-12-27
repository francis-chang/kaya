import { PassportStatic } from 'passport'
import { Strategy } from 'passport-local'
import { client } from '../prismaClient'
import * as argon2 from 'argon2'

export default (passport: PassportStatic) => {
    passport.use(
        new Strategy(async (username, password, done) => {
            try {
                const user = await client.user.findUnique({
                    where: {
                        lower_username: username.toLowerCase(),
                    },
                })

                if (user && (await argon2.verify(user.password, password))) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } catch (err) {
                return done(err)
            }
        })
    )
}
