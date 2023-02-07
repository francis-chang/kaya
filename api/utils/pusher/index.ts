import Pusher from 'pusher'

const { PUSHER_APPID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env

if (!PUSHER_APPID && !PUSHER_KEY && !PUSHER_SECRET && !PUSHER_CLUSTER) {
    console.log('pusher env vars are missing')
}

const pusher = new Pusher({
    appId: PUSHER_APPID ? PUSHER_APPID : '',
    key: PUSHER_KEY ? PUSHER_KEY : '',
    secret: PUSHER_SECRET ? PUSHER_SECRET : '',
    cluster: PUSHER_CLUSTER ? PUSHER_CLUSTER : '',
})

export default pusher
