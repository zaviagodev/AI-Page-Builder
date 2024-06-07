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

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const slug = data.slug;

        if(slug==='') {
            res.status(200).json({ ok:true, status: 422, error: 'Home page cannot be deleted.' });
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

            const myquery = { 
                slug: slug,
                username: username
            };
            await db.collection('pages').deleteOne(myquery);

            await db.collection('pages_published').deleteOne(myquery);

            await client.close();
            res.status(200).json({ ok:true, status: 200 });
        } catch (error) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    }
}

export default handler;
