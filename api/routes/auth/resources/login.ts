import { Request, Response, NextFunction } from 'express'
import passport from '../../../utils/passport'

const login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            res.status(401).json({ msg: 'Invalid Username or Password, Please Try Again.' })
            return
        } else {
            req.login(user, function (err) {
                if (err) {
                    return next(err)
                }
                req.session.userId = user.user_id
                // since auth is always hit on app.fty.gg
                // is returning a response necessary?
                // maybe just return cookie
                res.status(200).json({
                    id: user.user_id,
                    username: user.username,
                })
            })
        }
    })(req, res, next)
}

export default login
