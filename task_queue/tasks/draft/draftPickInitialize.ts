import { addToQueueDelay } from '../../utils/producer'
import { client } from '../../utils/prismaClient'
import wrapPrismaQuery from '../../utils/prismaTryCatch'
import { addSeconds } from 'date-fns'
import pusher from '../../utils/pusher'

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
    const draft = await wrapPrismaQuery(() => findDraft(draft_id))
    if (draft) {
        if (draft.status === 'NOT_STARTED') {
            await wrapPrismaQuery(() => initializeDraft(draft_id))
            console.log(`draft id ${draft_id} has started`)
            if (draft.pick_position === 1) {
                const draft_interval_time = draft.userforgame.game.draft_interval_time
                const time_till_next_pick = addSeconds(new Date(), draft_interval_time + 3)
                await wrapPrismaQuery(() => updateDraftTimeTillNextPick(draft_id, time_till_next_pick, true))
                await addToQueueDelay(
                    'computerDraftPick',
                    { draft_id, pick_to_check: 1 },
                    draft_interval_time * 1000 + 3000
                )
                await pusher.trigger(`draft_${draft_id}`, 'draft_init', {
                    is_player_turn: true,
                    time_till_next_pick,
                    current_pick: 1,
                })
            } else {
                await addToQueueDelay('computerDraftPick', { draft_id, pick_to_check: 1 }, 1000)
                await pusher.trigger(`draft_${draft_id}`, 'draft_init', {
                    is_player_turn: false,
                    time_till_next_pick: null,
                    current_pick: 1,
                })
            }
        } else {
            console.log(`draft_id ${draft_id} was requested to start, but does not current have the "NOT_STARTED" flag`)
        }
    }
}
