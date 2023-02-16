async function wrapPrismaQuery<T>(fn: () => Promise<T>): Promise<T | undefined> {
    try {
        const result = await fn()
        return result
    } catch (error) {
        console.error(error)
        // elaborate error logging
    }
    return undefined
}

export default wrapPrismaQuery
