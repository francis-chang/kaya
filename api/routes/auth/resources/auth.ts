import { Request, Response, NextFunction } from 'express'
import passport from '../../../utils/passport'

const auth = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            res.status(401).json({ msg: 'Invalid Username or Password, Please Try Again.' })
            return
        } else {
            res.status(200).json({
                id: user?.user_id,
                username: user?.username,
                session: req.session,
                user: user,
            })
        }
    })(req, res, next)
}

export default auth
