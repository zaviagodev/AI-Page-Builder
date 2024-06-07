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

    if(req.method === 'POST') {

        const data = JSON.parse(req.body)
        const username = data.username;
        const email = data.email;
        const newpassword = data.newpassword;
        const domainName = data.domainName;
        const inactive = data.inactive;

        if(!email || !email.includes('@')) {
            res.status(200).json({ ok:true, status: 422, error: 'Invalid email format.' });
            return;
        }

        let hashedPassword;
        let bUpdatePwd = false;
        if(newpassword!=='') {
            // if(newpassword.trim().length < 7) {
            //     res.status(200).json({ ok:true, status: 422, error: 'Invalid input - password should be at least 7 characters long.' });
            //     return;
            // }
            hashedPassword = await hashPassword(newpassword);
            bUpdatePwd=true;
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
            const user = await db.collection('users').findOne({
                username: username
            });
            if(user) {
                // Update
                const myquery = { username: username };
                let newvalues;
                if(bUpdatePwd) {
                    if(username==='admin') {
                        newvalues = { 
                            $set: {
                                email: email,
                                password: hashedPassword,
                                inactive: inactive
                            } 
                        };
                    } else {
                        newvalues = { 
                            $set: {
                                email: email,
                                password: hashedPassword,
                                inactive: inactive,
                                domainName: domainName
                            } 
                        };
                    }
                } else {
                    if(username==='admin') {
                        newvalues = { 
                            $set: {
                                email: email,
                                inactive: inactive
                            } 
                        };
                    } else {
                        newvalues = { 
                            $set: {
                                email: email,
                                inactive: inactive,
                                domainName: domainName
                            } 
                        };
                    }
                }
                await db.collection('users').updateOne(myquery, newvalues);
            }

            await client.close();
            res.status(200).json({ ok:true, status: 200, email: email });

        } catch(e) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
       
    }

}

export default handler;
