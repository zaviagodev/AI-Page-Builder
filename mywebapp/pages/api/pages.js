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

    try {
        const db = client.db();
        const pages = await db.collection('pages').find({
            username: username
        }).sort({ _id: -1 }).toArray();

        await client.close();
        res.status(200).json({ ok:true, status: 200, pages: pages });
        
    } catch(e) {
        await client.close();
        res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
    }
}

export default handler;
