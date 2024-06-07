import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

async function handler(req, res) {

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }

    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }
    const username = token.name;

    if(req.method === 'POST') { // Save

        const data = JSON.parse(req.body)
        const mailSmtp = data.mailSmtp;
        const mailPort = data.mailPort;
        const mailUser = data.mailUser;
        const mailPassword = data.mailPassword;
        const mailFrom = data.mailFrom;
        const mailName = data.mailName;

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        try {
            const db = client.db();
            const user = await db.collection('users').findOne({
                username: username
            });
            if(user) {
                const myquery = { username: username };
                let newvalues = { 
                    $set: {
                        mailSmtp: mailSmtp,
                        mailPort: mailPort,
                        mailUser: mailUser,
                        mailPassword: mailPassword,
                        mailFrom: mailFrom,
                        mailName: mailName,
                    } 
                };
                await db.collection('users').updateOne(myquery, newvalues);
            }

            await client.close();
            res.status(200).json({ ok:true, status: 200 });

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    } 
}

export default handler;
