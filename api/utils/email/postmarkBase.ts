import axios from 'axios'

const base = axios.create({
    baseURL: 'https://api.postmarkapp.com/',
    timeout: 4000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// realistically, this should be loaded off to task-queue

const sendRegisterConfirmation = async (toEmail: string, confirmation_code: string) => {
    try {
        await base.post(
            '/email',
            {
                From: 'FTY Fantasy Sports <noreply@fty.gg>',
                To: toEmail,
                Subject: 'User Regsiter Confirmation',
                TextBody: `Your confirmation code is ${confirmation_code}`,
                MessageStream: 'outbound',
            },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN,
                },
            }
        )
    } catch (err) {
        console.log(err)
    }
}

export { sendRegisterConfirmation }

// authRouter.get('/sendtestemail', async (req, res) => {

//     try {
//         await axios.post(
//             'https://api.postmarkapp.com/email',
//             {
//                 From: 'FTY Fantasy Sports <noreply@fty.gg>',
//                 To: 'fcs.kb24@gmail.com',
//                 Subject: 'Postmark Test',
//                 TextBody: 'Hello deark postmark user.',
//                 MessageStream: 'outbound',
//             },
//             {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                     'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN,
//                 },
//             }
//         )
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ hello: 'hello' })
//         return
//     }
//     res.status(200).json({ hello: 'hello' })
//     return
// })
