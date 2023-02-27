import express, { Request, Response, NextFunction } from 'express'
import passport from '../../utils/passport'
import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'
import session from '../../utils/session'
import { computerDraftPick } from '../../utils/tasks'
import { startDraftEndpoint } from './draftStatus'
import playerPick from './playerPick'

const draftRouter = express.Router()

draftRouter.post('/drafttest', async (req, res, next) => {
    const { draft_id } = req.body as { draft_id: number }
    await computerDraftPick(draft_id)
    res.status(200).json('yellow')
})

draftRouter.use(session)
draftRouter.use(passport.initialize())
draftRouter.use(passport.session())

const findUser = async (userId: number) => {
    return await client.user.findUnique({
        where: { user_id: userId },
    })
}

async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const user = req.session.passport?.user
    if (req.isAuthenticated() && user) {
        const response = await wrapPrismaQuery(() => findUser(user), res)
        if (!response) {
            res.status(401).json({ msg: 'UNAUTHENTICATED' })
        } else {
            if (!response.verified) {
                res.status(401).json({ msg: 'Please go to Settings to verify your account.' })
            }
            res.locals.user = response
            return next()
        }
    }
    res.status(401).json({ msg: 'UNAUTHENTICATED' })
}

draftRouter.use(ensureAuthenticated)

draftRouter.get('/get', async (req, res, next) => {
    const { draft_id } = req.body
    if (!draft_id) {
        return res.status(400).json({ msg: 'Please provide draft_id' })
    } else {
        const draft = await wrapPrismaQuery(async () => {
            return await client.draft.findUnique({
                where: { draft_id },
            })
        }, res)
        if (draft) {
            return res.status(200).json(draft)
        }
    }
    next()
})

draftRouter.post('/draftstart', startDraftEndpoint)

draftRouter.post('/playerpick', playerPick)

export default draftRouter
