import { Job } from 'bullmq'
import computerDraftPick from './draft/computerDraftPick'

export default async (job: Job) => {
    switch (job.name) {
        case 'computerDraftPick':
            computerDraftPick(job.data)
            break
        default:
            break
    }
}
