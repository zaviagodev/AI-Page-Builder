import { connectDatabase } from '../../src/db';
// import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";
import fs from 'fs';
import path from 'path';
import { s3Client } from '../../src/s3client';

async function emptyS3Directory(bucket, dir) {

    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    s3Client.listObjectsV2(listParams, function (err, listedObjects) {
        if (err) return;
   
        if (listedObjects.Contents.length === 0) {
            return;
        }

        listedObjects.Contents.map(({
            Key
        }) => {
            const params = {
                Bucket: bucket,
                Key: Key
            };
            // console.log(Key)
            s3Client.deleteObject(params, function(err, data) {
                if (err) {
                  console.log(err);
                } 
            });

        });
    });
}

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

        if(username==='admin') {
            res.status(200).json({ ok:true, status: 422, error: 'Admin user cannot be deleted.' });
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
                username: username 
            };
            await db.collection('users').deleteOne(myquery);

            await db.collection('pages').deleteMany(myquery);

            await db.collection('pages_published').deleteMany(myquery);

            if (process.env.SPACES_URL) { // If using DigitalOcean Spaces
                    
                await emptyS3Directory(process.env.SPACES_BUCKET, `${username}/`);

            } else {

                const directoryPath = path.join(process.env.WEB_ASSETS_PATH, 'uploads/' + username);

                if(fs.existsSync(directoryPath)) fs.rmdirSync(directoryPath, { recursive: true });

            }

            await client.close();
            res.status(200).json({ ok:true, status: 200 });
        } catch (error) {
            await client.close();
            res.status(200).json({ ok:true, status: 500, error: 'Something went wrong.' });
        }
    }
}

export default handler;
