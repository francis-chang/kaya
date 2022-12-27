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
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(json())
app.use(session)
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('tiny'))

app.use('/', defaultRouter)

app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
