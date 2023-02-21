import axios from 'axios'
import { client } from '../../utils/prismaClient'
import wrapPrismaQuery from '../../utils/prismaTryCatch'

// IT IS OPTIMAL THAT KAYA HAS IT'S OWN CACHE FOR COMPUTER_DRAFT_LIST FROM YASHA REDIS
// HOWEVER FOR NOW, JUST FETCH
const YASHA_URL = 'https://yasha.fty.gg/rdata'

const findDraft = async (draft_id: number) => {
    return await client.draft.findUnique({
        where: { draft_id },
        include: { userforgame: { include: { game: true } } },
    })
}

interface DraftListInterface {
    s_name: string
    PlayerID: number
    TotalFantasyPoints: string
}

const updateDraft = async (picks: any[], draft_id: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: { picks },
    })
}

export default async (draft_id: number) => {
    try {
        const a = wrapPrismaQuery(() => findDraft(draft_id))
        const b = axios.get<DraftListInterface[]>(`${YASHA_URL}/key/COMPUTER_DRAFT_LIST`)
        const responses = await Promise.all([a, b])
        if (responses[0] && responses[1]) {
            const [draft, axios_response] = responses
            const { draft_started, draft_ended, picks } = draft
            const { data } = axios_response

            let new_picks = picks
            if (new_picks) {
                //@ts-ignore
                const pick_numbers = picks.map((pick: any) => pick.PlayerID)
                console.log(pick_numbers)
                const available_players = data.filter((player) => !pick_numbers.includes(player.PlayerID))
                //@ts-ignore
                new_picks.push(available_players[0])
            } else {
                //@ts-ignore
                new_picks = [data[0]]
            }
            //@ts-ignore
            await wrapPrismaQuery(() => updateDraft(new_picks, draft_id))
        }
    } catch (err) {
        console.log(err)
    }
}
