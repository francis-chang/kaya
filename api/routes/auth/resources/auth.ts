import { Request, Response, NextFunction } from 'express'

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.user_id && req.user?.username) {
        res.json({ id: req.user?.user_id, username: req.user?.username, session: req.session, user: req.user })
    } else {
        if (process.env.NODE_ENV === 'development') {
            res.status(401).json({ msg: 'user is not logged in' })
        } else {
            //user attempted to log in with incorrect credentials
            res.status(401)
        }
    }
}

export default auth
