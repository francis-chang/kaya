import express from 'express'

import createUser from './resources/createUser'

const authRouter = express.Router()

authRouter.post('/createuser', createUser)

export default authRouter
