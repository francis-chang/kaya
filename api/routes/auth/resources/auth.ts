import { Request, Response, NextFunction } from 'express'

const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id && req.user?.username) {
        res.json({ id: req.user?.id, username: req.user?.username })
    } else {
        if (process.env.NODE_ENV === 'development') {
            res.status(401).json({ msg: 'user is not logged in' })
        } else {
            res.status(401)
        }
    }
}

export default auth
