import { Queue } from 'bullmq'
import IORedis from 'ioredis'

const url = process.env.REDIS_BULLMQ_URL ? process.env.REDIS_BULLMQ_URL : ''
if (url === '') {
    console.log('ERROR: env var REDIS_BULLMQ_URL not set, please check env vars of directory in docker-compose.yml')
}

const connection = new IORedis(url, { maxRetriesPerRequest: null })
const statsqueue = new Queue('myqueue', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
})

export default statsqueue
