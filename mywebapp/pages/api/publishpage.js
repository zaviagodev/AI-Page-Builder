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

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        try {
            const db = client.db();

            let result = await db.collection('pages').find({ slug: slug, username: username }).toArray();

            let resultPublished = await db.collection('pages_published').find({ slug: slug, username: username }).toArray();

            if(resultPublished.length===0) {
                // Insert
                let jsonData = result[0];
                delete jsonData['online'];
                delete jsonData['_id'];

                await db.collection('pages_published').insertOne(jsonData);

            } else {
                // Update
                let jsonData = result[0];
                delete jsonData['online'];
                delete jsonData['_id'];

                const myquery = { slug: slug, username: username };
                const newvalues = { 
                    $set: jsonData
                };
                await db.collection('pages_published').updateOne(myquery, newvalues);

            }

            const myquery = { slug: slug, username: username };
            const newvalues = { 
                $set: {
                    online: true
                } 
            };

            await db.collection('pages').updateOne(myquery, newvalues);

            await client.close();
            res.status(200).json({ ok:true, status: 200 });

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    }
}

export default handler;
