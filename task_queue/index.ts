import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import jobProcessor from './tasks'

if (process.env.REDIS_BULLMQ_URL) {
    const connection = new IORedis(process.env.REDIS_BULLMQ_URL, {
        maxRetriesPerRequest: null,
    })

    const worker = new Worker('myqueue', jobProcessor, {
        connection,
    })

    // worker.on('')

    worker.on('completed', (job) => {
        console.log(`${job.id} has completed!`)
    })

    worker.on('failed', (job, err) => {
        if (job) {
            console.log(`${job.id} has failed with ${err.message}`)
        } else {
            console.log('no job')
        }
    })
} else {
    console.log('env var REDIS_BULLMQ_URL not found, please check bull service in docker-compose.yml')
}
