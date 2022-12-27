import express, { Express, json } from 'express'
import cors from 'cors'

import morgan from 'morgan'
import defaultRouter from './routes'

const app: Express = express()

const { PORT } = process.env
const port = PORT ? PORT : 5555

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(json())
app.use(morgan('tiny'))

app.use('/', defaultRouter)

app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
