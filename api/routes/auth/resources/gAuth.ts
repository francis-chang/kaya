import { NextFunction, Request, Response } from 'express'
import passport from '../../../utils/passport'

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : ''

const gAuth = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', function (err, user, info) {
        if (err) {
            console.log(err)
            return next(err)
        }
        if (!user) {
            return NODE_ENV === 'development'
                ? res.redirect('http://localhost:5173/')
                : res.redirect('http://app.fty.gg')
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err)
                return next(err)
            }
            return NODE_ENV === 'development'
                ? res.redirect('http://localhost:5173/')
                : res.redirect('http://app.fty.gg')
        })
    })(req, res, next)
}

export default gAuth
