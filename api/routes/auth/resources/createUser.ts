import { client } from '../../../utils/prismaClient'
import { NextFunction, Request, Response } from 'express'
import { wrapPrismaQuery } from '../../../utils/prismaTryCatch'
import Validator, { ValidationSchema } from 'fastest-validator'
import * as argon2 from 'argon2'

const v = new Validator()

const schema: ValidationSchema = {
    username: { type: 'string', optional: false },
    password: { type: 'string', optional: false },
    email: { type: 'string', optional: false },
}
const check = v.compile(schema)

const validate = (body: any): { isValid: boolean; errors: null | object } => {
    const jsonValidation = check(body)
    if (jsonValidation === true) {
        const { username, password, email } = body
        const userNameLengthValid = username.length >= 6 && username.length <= 30
        if (!userNameLengthValid) {
            return { isValid: false, errors: { msg: `${username} length is not between 5 and 20 inclusive` } }
        }

        // may only contain letters, numbers, and underscores
        const usernameRegex = /^[a-zA-Z0-9_.]+$/
        const userRegexValid = usernameRegex.test(username)
        if (!userRegexValid) {
            return { isValid: false, errors: { msg: `Username ${username} did not pass regex validation` } }
        }
        if (
            username[0] === '_' ||
            username[username.length - 1] === '_' ||
            username[0] === '.' ||
            username[username.length - 1] === '.'
        ) {
            return {
                isValid: false,
                errors: { msg: `Username ${username} cannot start or end with an underscore or period` },
            }
        }

        const passwordLengthValid = password.length >= 8 && password.length <= 100
        if (!passwordLengthValid) {
            return { isValid: false, errors: { msg: `Password length is not between 8 and 100 inclusive` } }
        }
        // Minimum eight characters, at least one letter, one number and one special character:
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        const regexValid = passwordRegex.test(password)
        if (!regexValid) {
            return { isValid: false, errors: { msg: 'Password did not pass regex validation' } }
        }

        const emailRegex =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        const emailRegexValid = emailRegex.test(email)
        if (!emailRegexValid) {
            return { isValid: false, errors: { msg: 'Email did not pass regex validation' } }
        }
        return { isValid: true, errors: null }
    } else {
        return { isValid: false, errors: jsonValidation }
    }
}

const findUserWithUsername = async (username: string) => {
    const lower_username = username.toLowerCase()
    return await client.user.findUnique({
        where: { lower_username },
    })
}

const findUserWithEmail = async (email: string) => {
    return await client.user.findUnique({
        where: { email },
    })
}

const createUser = async (user: { username: string; password: string; email: string }) => {
    const { username, password, email } = user
    return await client.user.create({
        data: {
            username,
            password: await argon2.hash(password),
            email,
            lower_username: username.toLowerCase(),
        },
        select: {
            user_id: true,
            username: true,
        },
    })
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const validation = validate(req.body)
    if (!validation.isValid) {
        res.status(400).json(validation.errors)
    } else {
        const { email, username, password } = req.body
        const userExistsWithUsername = await wrapPrismaQuery(() => findUserWithUsername(username), res)
        if (userExistsWithUsername) {
            res.status(400).json({ msg: `Username ${username} already taken.` })
        } else {
            const userExistsWithEmail = await wrapPrismaQuery(() => findUserWithEmail(email), res)
            if (userExistsWithEmail) {
                res.status(400).json({ msg: `Email ${email} already taken.` })
            } else {
                const createdUser = await createUser({ username, password, email })
                req.session.userId = createdUser.user_id
                return res.status(201).json(createdUser)
            }
        }
    }
}
