import { Response } from 'express'

async function wrapPrismaQuery<T>(fn: () => Promise<T>, response: Response): Promise<T | undefined> {
    try {
        const result = await fn()
        return result
    } catch (error) {
        console.error(error)
        // elaborate error logging
        response.status(400).send()
    }
    return undefined
}

async function wrapPrismaQueryNoResponse<T>(fn: () => Promise<T>): Promise<T | undefined> {
    try {
        const result = await fn()
        return result
    } catch (error) {
        console.error(error)
        // elaborate error logging
    }
    return undefined
}

export { wrapPrismaQuery, wrapPrismaQueryNoResponse }
