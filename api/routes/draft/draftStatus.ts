import { Request, Response, NextFunction } from 'express'
import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'

const startDraft = async (draft_id: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: { status: 'STARTED' },
    })
}

const startDraftEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    const { draft_id } = req.body as { draft_id: number }
    await wrapPrismaQuery(() => startDraft(draft_id), res)
}

export { startDraftEndpoint }
