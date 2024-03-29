import addSeconds from 'date-fns/addSeconds'
import { Request, Response, NextFunction } from 'express'
import pusher from '../../utils/pusher'
import { client } from '../../utils/prismaClient'
import { wrapPrismaQuery } from '../../utils/prismaTryCatch'
import statsqueue from '../../utils/tasks/producer'

interface DraftListInterface {
    s_name: string
    PlayerID: number
}

const findDraft = async (draft_id: number) => {
    return await client.draft.findUnique({
        where: { draft_id },
        include: { userforgame: { include: { game: true } } },
    })
}

const addToQueueDelay = async (name: string, data: any, delay: number) => {
    try {
        await statsqueue.add(name, data, { delay })
    } catch (err) {
        console.log(err)
    }
}

const updateDraft = async (
    draft_id: number,
    picks: DraftListInterface[],
    all_picks: DraftListInterface[],
    current_pick: number
) => {
    return await client.draft.update({
        where: { draft_id },
        data: {
            //@ts-ignore
            picks,
            //@ts-ignore
            all_picks,
            current_pick,
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
    })
}

const updateDraftTimeTillNextPickNonPlayer = async (draft_id: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: {
            is_player_turn: false,
        },
    })
}

function getDraftPick(current_pick: number, num_teams: number) {
    const current_round = Math.ceil(current_pick / num_teams) // Calculate the current round
    const current_pick_in_round = current_pick % num_teams || num_teams // Calculate the current pick number in the round

    return `Round ${current_round} Pick ${current_pick_in_round}`
}

const player_pick_for_draft = async (req: Request, res: Response, next: NextFunction) => {
    const { draft_id, player_tobe_drafted } = req.body as { draft_id: number; player_tobe_drafted: DraftListInterface }
    const draft = await wrapPrismaQuery(() => findDraft(draft_id), res)

    if (draft) {
        const { current_pick, pick_numbers } = draft
        if (!draft_id || !player_tobe_drafted) {
            return res.status(400).json({ msg: 'Does not have correct request body' })
        }
        if (!pick_numbers.includes(current_pick)) {
            return res.status(401).json({ msg: 'It is currently not your turn' })
        }
        if (!draft.is_player_turn) {
            return res.status(401).json({ msg: 'It is currently not your turn' })
        }
        const now = new Date()
        if (draft.time_till_next_pick && now > draft.time_till_next_pick) {
            return res.status(401).json({ msg: 'The time has passed for you to pick' })
        }
        // this is a naive insert, the client could have sent fake player data
        // realisitically, you would check the nba player drafted against an actual list of players
        // it will only check if it has already not been picked
        else {
            //@ts-ignore
            const picked_player_ids = draft.all_picks!.map((player) => player.PlayerID)
            if (picked_player_ids.includes(player_tobe_drafted.PlayerID)) {
                return res.status(401).json({ msg: `${player_tobe_drafted.s_name} has already been drafted` })
            } else {
                const drafted_player = {
                    ...player_tobe_drafted,
                    info: getDraftPick(draft.current_pick, draft.userforgame.game.numberOfTeamsToSimul),
                    picked_at: draft.current_pick,
                    type: 'PLAYER_PICK',
                }
                //@ts-ignore
                const picks = [...draft.picks, drafted_player]
                //@ts-ignore
                const all_picks = [...draft.all_picks, drafted_player]
                const current_pick = draft.current_pick + 1

                if (pick_numbers.includes(current_pick)) {
                    const draft_interval_time = draft.userforgame.game.draft_interval_time
                    const time_till_next_pick = addSeconds(new Date(), draft_interval_time + 3)
                    await wrapPrismaQuery(() => updateDraftTimeTillNextPick(draft_id, time_till_next_pick, true), res)
                    await addToQueueDelay(
                        'computerDraftPick',
                        { draft_id, pick_to_check: current_pick },
                        draft_interval_time * 1000 + 3000
                    )
                    await pusher.trigger(`draft_${draft_id}`, 'draft_player_pick', {
                        is_player_turn: true,
                        time_till_next_pick,
                        current_pick: current_pick,
                        picked_player: drafted_player,
                    })
                } else {
                    await wrapPrismaQuery(() => updateDraftTimeTillNextPickNonPlayer(draft_id), res)
                    await addToQueueDelay('computerDraftPick', { draft_id, pick_to_check: current_pick }, 1000)
                    await pusher.trigger(`draft_${draft_id}`, 'draft_player_pick', {
                        is_player_turn: false,
                        time_till_next_pick: null,
                        current_pick: current_pick,
                        picked_player: drafted_player,
                    })
                }
                const response = await wrapPrismaQuery(
                    () => updateDraft(draft.draft_id, picks, all_picks, current_pick),
                    res
                )
                return res.status(201).json(response)
            }
        }
    }
    next()
}

export default player_pick_for_draft
