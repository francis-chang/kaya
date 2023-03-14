import axios from 'axios'
import addSeconds from 'date-fns/addSeconds'
import { addToQueueDelay } from '../../utils/producer'
import { client } from '../../utils/prismaClient'
import wrapPrismaQuery from '../../utils/prismaTryCatch'
import pusher from '../../utils/pusher'

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

const updateDraft = async (all_picks: any[], picks: any[], draft_id: number, current_pick: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: { all_picks, picks, current_pick },
    })
}

const endDraft = async (draft_id: number) => {
    return await client.draft.update({
        where: { draft_id },
        data: {
            draft_ended: new Date(),
            status: 'ENDED',
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

const updateDraftPlayerTurn = async (draft_id: number) => {
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

type Props = {
    draft_id: number
    pick_to_check: number
}

export default async ({ draft_id, pick_to_check }: Props) => {
    try {
        const a = wrapPrismaQuery(() => findDraft(draft_id))
        const b = axios.get<DraftListInterface[]>(`${YASHA_URL}/key/COMPUTER_DRAFT_LIST`)
        const responses = await Promise.all([a, b])
        if (responses[0] && responses[1]) {
            const [draft, axios_response] = responses
            if (draft.current_pick !== pick_to_check) {
                console.log('computer current_pick conflict - the player must have chosen')
                return
            } else if (draft.current_pick > Math.max(...draft.pick_numbers)) {
                console.log('Draft Ended')
                await wrapPrismaQuery(() => endDraft(draft_id))
                return
            }
            const { draft_started, draft_ended, picks, all_picks } = draft
            const { data } = axios_response

            //@ts-ignore
            const drafted_player_ids = all_picks.map((pick: any) => pick.PlayerID)
            const available_players = data.filter((player) => !drafted_player_ids.includes(player.PlayerID))

            const chosen_player = {
                ...available_players[0],
                info: getDraftPick(draft.current_pick, draft.userforgame.game.numberOfTeamsToSimul),
                picked_at: draft.current_pick,
                type: draft.pick_numbers.includes(draft.current_pick) ? 'PLAYER_PICK' : 'COMPUTER_PICK',
            }

            //@ts-ignore
            all_picks.push(chosen_player)

            if (draft.pick_numbers.includes(draft.current_pick)) {
                //@ts-ignore
                picks.push(chosen_player)
            }
            //@ts-ignore
            await wrapPrismaQuery(() => updateDraft(all_picks, picks, draft_id, draft.current_pick + 1))
            if (draft.pick_numbers.includes(draft.current_pick + 1)) {
                const time_till_next_pick = addSeconds(new Date(), draft.userforgame.game.draft_interval_time + 3)
                await wrapPrismaQuery(() => updateDraftTimeTillNextPick(draft_id, time_till_next_pick, true))
                await addToQueueDelay(
                    'computerDraftPick',
                    { draft_id, pick_to_check: draft.current_pick + 1 },
                    draft.userforgame.game.draft_interval_time * 1000 + 3000
                )
                await pusher.trigger(`draft_${draft_id}`, 'draft_computer_pick', {
                    is_player_turn: true,
                    time_till_next_pick,
                    current_pick: draft.current_pick + 1,
                    picked_player: chosen_player,
                })
            } else {
                await wrapPrismaQuery(() => updateDraftPlayerTurn(draft_id))
                await addToQueueDelay('computerDraftPick', { draft_id, pick_to_check: draft.current_pick + 1 }, 1000)
                await pusher.trigger(`draft_${draft_id}`, 'draft_computer_pick', {
                    is_player_turn: false,
                    time_till_next_pick: null,
                    current_pick: draft.current_pick + 1,
                    picked_player: chosen_player,
                })
            }
        }
    } catch (err) {
        console.log(err)
    }
}
