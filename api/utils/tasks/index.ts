import statsqueue from './producer'

const addToQueue = (name: string, data: any) => {
    try {
        statsqueue.add(name, data)
    } catch (err) {
        console.log(err)
    }
}

// loadTopStatlines(job.data.numberOfDaysAgo, job.data.numberOfStatlines)

const computerDraftPick = async (draft_id: number) => {
    addToQueue('computerDraftPick', draft_id)
}

export { computerDraftPick }
