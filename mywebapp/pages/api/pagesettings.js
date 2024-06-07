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

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        const data = JSON.parse(req.body);
        const action = data.action;
        const slug = data.slug;

        if(action==='get') {

            try {
                const db = client.db();
                const content = await db.collection('pages').findOne({
                    slug: slug, 
                    username: username
                });
    
                await client.close();
                res.status(200).json({ ok:true, status: 200, content });
                
            } catch(e) {
                await client.close();
                res.status(500).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }

        } else { //save
            
            const slugTarget = data.slugTarget;
            const slug = data.slug;
            const title = data.title;
            const desc = data.desc;
            const socialImage = data.socialImage;
            const blank = data.blank;

            try {
                const db = client.db();
                const myquery = { slug: slugTarget, username: username };
                const newvalues = { 
                    $set: {
                        slug: slug,
                        title: title,
                        desc: desc,
                        socialImage: socialImage,
                        blank: blank,
                    } 
                };
                await db.collection('pages').updateOne(myquery, newvalues);
                
                await db.collection('pages_published').updateOne(myquery, newvalues);
    
                await client.close();
                res.status(200).json({ ok:true, status: 201 });
    
            } catch(e) {
                await client.close();
                res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
            }

        }
       
    } 

}

export default handler;
