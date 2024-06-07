import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

async function handler(req, res) {

    // const session = await getSession( { req: req } );

    if(req.method === 'POST') {

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

        const data = JSON.parse(req.body)
        const slug = data.slug;
        const title = data.title;
        const desc = data.desc;

        if(slug==='index'||slug==='login'||slug==='signup'||slug==='confirm'||
            slug==='dashboard'||slug==='admin'||slug==='edit'||slug==='assets'||
            slug==='500'||slug==='posts') {
            res.status(200).json({ ok:true, status: 422, error: 'Slug is already in use by the system.' });
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
            const result = await db.collection('pages').findOne({
                slug: slug,
                username: username
            });
            if(result) {
                client.close();
                res.status(200).json({ ok:true, status: 422, error: 'Slug already exists.' });
            } else {
                await db.collection('pages').insertOne({
                    slug: slug,
                    title: title,
                    desc: desc,
                    html: '',
                    username: username
                });
                await client.close();
                res.status(200).json({ ok:true, status: 201 });
            }

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }

    }
}

export default handler;
