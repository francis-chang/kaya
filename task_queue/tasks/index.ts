import { Job } from 'bullmq'
import computerDraftPick from './draft/computerDraftPick'
import draftPickInitialize from './draft/draftPickInitialize'

export default async (job: Job) => {
    switch (job.name) {
        case 'computerDraftPick':
            computerDraftPick(job.data)
            break
        case 'draftInitialize':
            draftPickInitialize(job.data)
            break
        default:
            break
    }
}
