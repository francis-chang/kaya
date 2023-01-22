import express, { Express, json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import session from './utils/session'
import defaultRouter from './routes'
import passport from './utils/passport'
const app: Express = express()

const { PORT } = process.env
const port = PORT ? PORT : 5555

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'app.fty.gg',
        'https://app.fty.gg',
        '164.92.105.119',
    ],
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
