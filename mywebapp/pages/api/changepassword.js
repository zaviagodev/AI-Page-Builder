import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import { hashPassword } from '../../src/auth';

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
        const password = data.password;

        if(!password || password.trim().length < 7) {
            res.status(200).json({ ok:true, status: 422, error: 'Invalid input - password should be at least 7 characters long.' });
            return;
        }

        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
            return;
        }

        const hashedPassword = await hashPassword(password);

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
                        password: hashedPassword
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
