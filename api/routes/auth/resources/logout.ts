import { Request, Response, NextFunction } from 'express'

const logout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) {
            res.status(500).json({ msg: 'LOGOUT_FAIL' })
        } else {
            res.status(200).json({ msg: 'LOGOUT_SUCCESS' })
        }
    })
}

export default logout
