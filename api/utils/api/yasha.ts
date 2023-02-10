import axios from 'axios'

const base = axios.create({
    baseURL: 'https://yasha.fty.gg/kayaendpoints',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
    },
})

const apiPost = async <T>(url: string, data: any): Promise<T | null> => {
    try {
        const response = await base.post<T, any>(url, data)
        return response.data
    } catch (err: any) {
        console.error(`error fetching ${url}`)
        if (err.response) {
            console.log(err.response.data)
        } else if (err.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js

            console.error(err.request)
        } else {
            // Something happened in setting up the request that triggered an err
            console.error(err.message)
        }

        return null
    }
}

type getScheduleSDResponse = {
    Key: string
    games: {
        GameID: number
        DateTime: string
        away_team: any
        home_team: any
    }[]
}[]

const getScheduleSD = async (num_games: number, draft_period: number) => {
    const response = await apiPost<getScheduleSDResponse>('/getschedulesd', { num_games, draft_period })
    return response
}

export { getScheduleSD }
