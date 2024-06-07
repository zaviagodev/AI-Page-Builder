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

    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
        return;
    }

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const email = data.email;

        if(!email || !email.includes('@')) {
            res.status(200).json({ ok:true, status: 422, error: 'Invalid email format.' });
            return;
        }

        try {
            const db = client.db();
            const user = await db.collection('users').findOne({
                username: username
            });
            if(user) {
                // Update
                const myquery = { username: username };
                const newvalues = { 
                    $set: {
                        email: email
                    } 
                };
                await db.collection('users').updateOne(myquery, newvalues);
            }

            await client.close();
            res.status(200).json({ ok:true, status: 200, email: email });

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
       
    } else {

        try {
            const db = client.db();
            const user = await db.collection('users').findOne({
                username: username
            });
            if(!user) {
                client.close();
                res.status(200).json({ ok:true, status: 401, error: 'User not found.' });
                return;
            }
            let email = user.email;

            await client.close();
            res.status(200).json({ ok:true, status: 200, email: email });
            
        } catch(e) {
            await client.close();
            res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }

    }

}

export default handler;
