import axios from 'axios'
import { addToQueueDelay } from '../../utils/producer'
import { client } from '../../utils/prismaClient'
import wrapPrismaQuery from '../../utils/prismaTryCatch'
import { addSeconds } from 'date-fns'

// IT IS OPTIMAL THAT KAYA HAS IT'S OWN CACHE FOR COMPUTER_DRAFT_LIST FROM YASHA REDIS
// HOWEVER FOR NOW, JUST FETCH
const YASHA_URL = 'https://yasha.fty.gg/rdata'

const findDraft = async (draft_id: number) => {
    return await client.draft.findUnique({
        where: { draft_id },
        include: { userforgame: { include: { game: true } } },
    })
}

const initializeDraft = async (draft_id: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: {
            draft_started: new Date(),
            status: 'STARTED',
            current_pick: 1,
        },
    })
}

const updateDraftTimeTillNextPick = async (draft_id: number, time_till_next_pick: Date, is_player_turn: boolean) => {
    return await client.draft.update({
        where: { draft_id },
        data: {
            time_till_next_pick,
            is_player_turn,
        },
        include: { userforgame: { include: { game: true } } },
    })
}

export default async (draft_id: number) => {
    console.log('helloooo')
    const draft = await wrapPrismaQuery(() => findDraft(draft_id))
    if (draft) {
        if (draft.status === 'NOT_STARTED') {
            await wrapPrismaQuery(() => initializeDraft(draft_id))
            console.log(`draft id ${draft_id} has started`)
            if (draft.pick_position === 1) {
                const draft_interval_time = draft.userforgame.game.draft_interval_time
                const time_till_next_pick = addSeconds(new Date(), draft_interval_time)
                await wrapPrismaQuery(() => updateDraftTimeTillNextPick(draft_id, time_till_next_pick, true))
                await addToQueueDelay('computerDraftPick', { draft_id, pick_to_check: 1 }, draft_interval_time * 1000)
            } else {
                await addToQueueDelay('computerDraftPick', { draft_id, pick_to_check: 1 }, 1000)
            }
        } else {
            console.log(`draft_id ${draft_id} was requested to start, but does not current have the "NOT_STARTED" flag`)
        }
    }
}
