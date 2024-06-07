import { connectDatabase } from '../../../src/db';
import { hashPassword } from '../../../src/auth';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

async function handler(req, res) {

    if(req.method !== 'POST') return;

    // const session = await getSession( { req: req } );

    const token = await getToken({ req })
    // if (!token) {
    //     res.status(200).json({ ok:true, status: 401, error: 'Not authenticated!' });
    //     return;
    // }
    // const username = token.name;

    let host = '';
    if (req) host = req.headers.host; 
  
    let isMainHost = false;
    if(host === process.env.MAIN_HOST || host === 'www.' + process.env.MAIN_HOST) isMainHost = true;

    if(!isMainHost) { // Disable signup from users' custom domain
        res.status(200).json({ ok:true, status: 500, error: 'Service unavailable' });
        return;
    }

    // Main Site
    let client;
    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(200).json({ ok:true, status: 500, error: 'Connecting to the database failed.' });
        return;
    }

    // Check if noSignup = true
    const db = client.db();
    const site = await db.collection('users').findOne({
        username: 'admin'
    });
    if(site.noSignup) {
        // If signup disabled
        if(token) {
            if(token.name==='admin') {
                // Allow admin to add user
            } else {
                await client.close();
                res.status(200).json({ ok:true, status: 500, error: 'Service unavailable' });
                return;
            }
        } else {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Service unavailable' });
            return;
        }
    }

    const data = JSON.parse(req.body)
    const username = data.username;
    const email = data.email;
    const password = data.password;

    if(!username ||
        !email || !email.includes('@') || 
        !password || password.trim().length < 7) {
        await client.close();
        res.status(200).json({ ok:true, status: 422, error: 'Invalid input - password should be at least 7 characters long.' });
        return;
    }

    // You can add reserved username here. 
    if(username==='public'||username==='private'||username==='storage') { 
        await client.close();
        res.status(200).json({ ok:true, status: 422, error: 'Username already in use.' });
        return;
    }

    try {
        const existingUser = await db.collection('users').findOne({
            username: username
        });
        const existingEmail = await db.collection('users').findOne({
            email: email
        });
        if(existingUser) {
            await client.close();
            res.status(200).json({ ok:true, status: 422, error: 'Username already in use.' });
            return;
        }
        if(existingEmail) {
            await client.close();
            res.status(200).json({ ok:true, status: 422, error: 'Email already registered.' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        await db.collection('users').insertOne({
            username: username,
            email: email,
            password: hashedPassword
        });

        await db.collection('pages').insertOne({
            title: 'Home - ' + username,
            desc: '',
            slug: '',
            html: '',
            username: username,
            online: true
        });

        await db.collection('pages_published').insertOne({
            title: 'Home - ' + username,
            desc: '',
            slug: '',
            html: '',
            username: username,
        });

        await client.close();
        res.status(200).json({ ok:true, status: 201 });
        
    } catch (error) {
        await client.close();
        res.status(200).json({ ok:true, status: 500, error: 'Unable to create user.' });
    }

}

export default handler;