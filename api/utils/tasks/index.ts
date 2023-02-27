import statsqueue from './producer'

const addToQueue = async (name: string, data: any) => {
    try {
        await statsqueue.add(name, data)
    } catch (err) {
        console.log(err)
    }
}

// loadTopStatlines(job.data.numberOfDaysAgo, job.data.numberOfStatlines)

const computerDraftPick = async (draft_id: number) => {
    await addToQueue('computerDraftPick', draft_id)
}

const draftInitialize = async (draft_id: number) => {
    await addToQueue('draftInitialize', draft_id)
}

export { computerDraftPick, draftInitialize }
