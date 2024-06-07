import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

async function handler(req, res) {

    // const session = await getSession( { req: req } );
    // if(!session) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }
    // if(session.user.name!=='admin') {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }

    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }
    const username = token.name;
    if(username!=='admin') {
        res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
        return;
    }

    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
        return;
    }

    try {
        const db = client.db();
        const users = await db.collection('users').find({
        }, { 
            projection: { 
                _id : 1, domainName : 1, email : 1, username : 1, domainName : 1, inactive: 1 
            }
        }).sort({ _id: -1 }).toArray();

        users.find(item => item.username == 'admin').domainName = process.env.MAIN_HOST;

        await client.close();
        res.status(200).json({ ok:true, status: 200, users: users });
        
    } catch(e) {
        await client.close();
        res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
    }
}

export default handler;
